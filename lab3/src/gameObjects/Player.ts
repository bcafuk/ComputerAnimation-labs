import Renderable from './Renderable';
import Updatable from './Updatable';
import Controllable from './Controllable';
import InputDevice from '../input/InputDevice';
import Canvas from '../display/Canvas';
import Camera from '../display/Camera';
import Controls from '../input/Controls';
import Vec3 from '../math/Vec3';

import spriteSource from '../../assets/textures/geoff.png';
import maxAbs from '../math/maxAbs';
import minAbs from '../math/minAbs';
import Track from './Track';

export default class Player implements Renderable, Updatable, Controllable<Controls> {
  private static readonly accelerationForce = 2;
  private static readonly brakingStrength = 5;
  private static readonly velocityDamping = 0.125;
  private static readonly maxSteeringAngle = Math.PI / 10;

  private readonly track: Track;

  public readonly position: Vec3;
  private velocity = 0;

  private forwardAcceleration = 0;
  private brakingDeceleration = 0;
  private steeringAngle = 0;

  private sprite: HTMLImageElement | null = null;

  public constructor(position: Vec3, track: Track) {
    this.position = position;
    this.track = track;

    this.sprite = null;
    const sprite = document.createElement('img');
    sprite.addEventListener('load', () => {
      this.sprite = sprite;
    });
    sprite.src = spriteSource;
  }

  public processInputs(dt: number, input: InputDevice<Controls>): void {
    this.forwardAcceleration = input.getInput(Controls.ACCELERATE) * Player.accelerationForce;
    this.brakingDeceleration = input.getInput(Controls.BRAKE) * Player.brakingStrength;

    const steeringAxis = input.getInput(Controls.STEERING);
    const steeringComponents = input.getInput(Controls.STEER_RIGHT)
      - input.getInput(Controls.STEER_LEFT);
    this.steeringAngle = maxAbs(steeringAxis, steeringComponents) * Player.maxSteeringAngle;
  }

  public render(canvas: Canvas, camera: Camera): void {
    const { screenPoint, scale } = camera.project(this.position, canvas);

    const x = Math.round(screenPoint.x - scale / 2);
    const y = Math.round(screenPoint.x - scale / 2);
    const width = Math.round(scale);
    const height = Math.round(scale);

    if (this.sprite !== null) {
      canvas.drawImage(this.sprite, x, y, width, height);
    } else {
      canvas.setFillStyle('fuchsia');
      canvas.fillRect(x, y, width, height);
    }
  }

  public update(dt: number): void {
    const centrifugal = this.track.getCurveAt(Math.floor(this.position.z)).x;

    const forwardAcceleration = this.forwardAcceleration - this.velocity * Player.velocityDamping;

    this.velocity -= minAbs(this.velocity, this.brakingDeceleration * dt);
    this.velocity += forwardAcceleration * dt;

    const rotatedVelocity = new Vec3(
      Math.sin(this.steeringAngle) * this.velocity,
      0,
      Math.cos(this.steeringAngle) * this.velocity,
    );

    rotatedVelocity.x -= rotatedVelocity.z * centrifugal * 2;

    this.position.addScaled(rotatedVelocity, dt);
  }
}
