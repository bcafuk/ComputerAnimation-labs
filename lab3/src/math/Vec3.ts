export default class Vec3 {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public setFrom(source: Vec3): this {
    return this.set(source.x, source.y, source.z);
  }

  public get length(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  public add(rhs: Vec3): this {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    return this;
  }

  public static add(lhs: Vec3, rhs: Vec3): Vec3 {
    return lhs.clone().add(rhs);
  }

  public sub(rhs: Vec3): this {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    return this;
  }

  public static sub(lhs: Vec3, rhs: Vec3): Vec3 {
    return lhs.clone().sub(rhs);
  }

  public mulComponents(rhs: Vec3): this {
    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    return this;
  }

  public static mulComponents(lhs: Vec3, rhs: Vec3): Vec3 {
    return lhs.clone().mulComponents(rhs);
  }

  public mulScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  public static mulScalar(vector: Vec3, scalar: number): Vec3 {
    return vector.clone().mulScalar(scalar);
  }

  public addScaled(vector: Vec3, scalar: number): this {
    this.x += vector.x * scalar;
    this.y += vector.y * scalar;
    this.z += vector.z * scalar;
    return this;
  }

  public static addScaled(base: Vec3, vector: Vec3, scalar: number): Vec3 {
    return base.clone().addScaled(vector, scalar);
  }

  public clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
}
