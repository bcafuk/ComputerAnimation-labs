import Canvas from './display/Canvas';
import World from './gameObjects/World';
import Camera from './display/Camera';
import Vec3 from './math/Vec3';
import InputDevice from './input/InputDevice';
import Controls from './input/Controls';
import Player from './gameObjects/Player';
import Track from './gameObjects/Track';

export default class Game {
  private static readonly maxFrameTime: number = 1 / 30;

  private static readonly cameraOffset = new Vec3(0, -1, -2.7);

  private readonly canvas: Canvas;
  private animationHandle: number | null = null;
  private lastFrameTime: DOMHighResTimeStamp = performance.now();

  private readonly camera: Camera = new Camera(new Vec3(0, 0, 0));
  private readonly world: World;
  private readonly player: Player;

  private readonly input: InputDevice<Controls>;

  public constructor(canvas: Canvas, input: InputDevice<Controls>, track: Track) {
    this.canvas = canvas;
    this.input = input;

    this.world = new World(track);
    this.player = new Player(new Vec3(0, 0, 0), track);
  }

  public get isRunning(): boolean {
    return this.animationHandle !== null;
  }

  public run(): boolean {
    if (this.animationHandle !== null) return false;

    this.lastFrameTime = performance.now();
    this.animationHandle = requestAnimationFrame(this.executeFrame.bind(this));
    return true;
  }

  public stop(): boolean {
    if (this.animationHandle === null) return false;

    cancelAnimationFrame(this.animationHandle);
    this.animationHandle = null;
    return true;
  }

  private executeFrame(time: DOMHighResTimeStamp) {
    const dt = Math.min(
      (time - this.lastFrameTime) / 1000,
      Game.maxFrameTime,
    );
    this.lastFrameTime = time;

    this.player.processInputs(dt, this.input);
    this.player.update(dt);

    this.camera.position.setFrom(this.player.position).add(Game.cameraOffset);

    this.world.render(this.canvas, this.camera);
    this.player.render(this.canvas, this.camera);

    this.canvas.display();

    this.animationHandle = requestAnimationFrame(this.executeFrame.bind(this));
  }
}
