import { Curve, Vector2, Vector3, Vector4, Matrix4 } from 'three';
import { clamp } from 'three/src/math/MathUtils';

export default class BSpline extends Curve<Vector3> {
  private controlPoints: Vector3[];

  private static readonly matB = new Matrix4().set(
    -1, 3, -3, 1,
    3, -6, 3, 0,
    -3, 0, 3, 0,
    1, 4, 1, 0,
  ).multiplyScalar(1 / 6).transpose();

  public constructor(controlPoints: Vector3[] = []) {
    super();

    this.type = 'BSpline';
    this.controlPoints = controlPoints;
  }

  public getPoint(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
    const segmentCount = this.controlPoints.length - 3;
    const i = clamp(Math.floor(t * segmentCount), 0, segmentCount - 1);
    const localT = t * segmentCount - i;

    const vecT = new Vector4(localT ** 3, localT ** 2, localT, 1);
    const matR = this.getMatR(i).transpose();

    const result = new Vector4()
      .copy(vecT)
      .applyMatrix4(BSpline.matB)
      .applyMatrix4(matR);
    optionalTarget.set(result.x, result.y, result.z);
    return optionalTarget;
  }

  public getTangent(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
    const segmentCount = this.controlPoints.length - 3;
    const i = clamp(Math.floor(t * segmentCount), 0, segmentCount - 1);
    const localT = t * segmentCount - i;

    const vecT = new Vector4(3 * localT ** 2, 2 * localT, 1, 0);
    const matR = this.getMatR(i).transpose();

    const result = new Vector4()
      .copy(vecT)
      .applyMatrix4(BSpline.matB)
      .applyMatrix4(matR)
      .normalize();
    optionalTarget.set(result.x, result.y, result.z);
    return optionalTarget;
  }

  private getMatR(i: number): Matrix4 {
    return new Matrix4().set(
      this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z, 1,
      this.controlPoints[i + 1].x, this.controlPoints[i + 1].y, this.controlPoints[i + 1].z, 1,
      this.controlPoints[i + 2].x, this.controlPoints[i + 2].y, this.controlPoints[i + 2].z, 1,
      this.controlPoints[i + 3].x, this.controlPoints[i + 3].y, this.controlPoints[i + 3].z, 1,
    );
  }

  public toJSON(): Record<string, any> {
    const data = super.toJSON() as Record<string, any>;
    data.points = this.controlPoints.map((point) => point.toArray());

    return data;
  }

  public fromJSON(json: Record<string, any>): this {
    super.fromJSON(json);
    this.controlPoints = json.points.map(
      (point: [number, number, number]) => new Vector2().fromArray(point),
    );

    return this;
  }
}
