import { Color, InstancedMesh, Matrix4, Object3D, Scene, Vector3 } from 'three';

export default class Lab2Scene extends Scene {
  private static readonly gravity = new Vector3(0, -9.81, 0);
  private static readonly rotationAxis = new Vector3(0, 0, 1);

  private static readonly particleLifetime = 2;

  private readonly particles: InstancedMesh;
  private readonly maxParticles: number;

  private readonly positions: Vector3[] = [];
  private readonly velocities: Vector3[] = [];
  private readonly sizes: number[] = [];
  private readonly ages: number[] = [];

  private readonly spawnRate: number;

  private time = 0;

  public constructor(particles: InstancedMesh, maxParticles: number) {
    super();

    this.particles = particles;
    this.add(this.particles);

    this.maxParticles = maxParticles;

    this.particles.setColorAt(0, new Color());
    this.particles.count = 0;

    this.spawnRate = this.maxParticles / Lab2Scene.particleLifetime;
  }


  public update(dt: number, camera: Object3D): void {
    this.time += dt;

    const oldParticleCount = this.particles.count;
    this.particles.count = Math.min(Math.round(this.time * this.spawnRate), this.maxParticles);

    for (let i = oldParticleCount; i < this.particles.count; i++) {
      this.positions[i] = new Vector3();
      this.velocities[i] = new Vector3();

      this.initializeParticle(i);
    }

    for (let i = 0; i < this.particles.count; i++) {
      this.velocities[i].addScaledVector(Lab2Scene.gravity, dt);

      this.positions[i].addScaledVector(Lab2Scene.gravity, 0.5 * dt ** 2);
      this.positions[i].addScaledVector(this.velocities[i], dt);

      this.ages[i] += dt;

      if (this.ages[i] > Lab2Scene.particleLifetime)
        this.initializeParticle(i);

      const lifetimeFraction = this.ages[i] / Lab2Scene.particleLifetime;

      const scale = this.sizes[i] * (1 - lifetimeFraction) ** 0.5;

      const matrix = new Matrix4();
      matrix.lookAt(this.positions[i], camera.position, this.up);
      matrix.scale(new Vector3(-scale, scale, -scale));
      matrix.setPosition(this.positions[i]);

      this.particles.setMatrixAt(i, matrix);

      const color = new Color(
        0.6 + (lifetimeFraction ** 0.6) * 0.4,
        0.8 + (lifetimeFraction ** 0.6) * 0.2,
        1.0,
      );
      this.particles.setColorAt(i, color);
    }

    this.particles.instanceMatrix.needsUpdate = true;
    if (this.particles.instanceColor !== null)
      this.particles.instanceColor.needsUpdate = true;
  }

  private initializeParticle(index: number): void {
    const positionAngle = Math.random() * Math.PI * 2;
    const positionRadius = Math.random() * 0.25;
    this.positions[index].set(
      positionRadius * Math.cos(positionAngle),
      0.5 + Math.random(),
      positionRadius * Math.sin(positionAngle),
    );

    const nozzleAngle = Math.sin(this.time / 16 * Math.PI * 2) * (Math.PI / 4);

    const velocityAngle = Math.random() * Math.PI * 2;
    const velocityRadius = Math.random() * 0.5;
    this.velocities[index].set(
      velocityRadius * Math.cos(velocityAngle),
      10 + Math.random() * 2,
      velocityRadius * Math.sin(velocityAngle),
    );

    this.positions[index].applyAxisAngle(Lab2Scene.rotationAxis, nozzleAngle);
    this.velocities[index].applyAxisAngle(Lab2Scene.rotationAxis, nozzleAngle);

    this.sizes[index] = 0.1 + Math.random() * 0.15;

    this.ages[index] = 0;
  }
}
