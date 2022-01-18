export default class Vec2 {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public set(x:number, y:number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public setFrom(source: Vec2): this {
    return this.set(source.x, source.y);
  }

  public get length(): number {
    return Math.hypot(this.x, this.y);
  }

  public add(rhs: Vec2): this {
    this.x += rhs.x;
    this.y += rhs.y;
    return this;
  }

  public static add(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.clone().add(rhs);
  }

  public sub(rhs: Vec2): this {
    this.x -= rhs.x;
    this.y -= rhs.y;
    return this;
  }

  public static sub(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.clone().sub(rhs);
  }

  public mulComponents(rhs: Vec2): this {
    this.x *= rhs.x;
    this.y *= rhs.y;
    return this;
  }

  public static mulComponents(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.clone().mulComponents(rhs);
  }

  public mulScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public static mulScalar(vector: Vec2, scalar: number): Vec2 {
    return vector.clone().mulScalar(scalar);
  }

  public addScaled(vector: Vec2, scalar: number): this {
    this.x += vector.x * scalar;
    this.y += vector.y * scalar;
    return this;
  }

  public static addScaled(base: Vec2, vector: Vec2, scalar: number): Vec2 {
    return base.clone().addScaled(vector, scalar);
  }

  public clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }
}
