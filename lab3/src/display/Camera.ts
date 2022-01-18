import Vec2 from '../math/Vec2';
import Vec3 from '../math/Vec3';
import Canvas from './Canvas';

export default class Camera {
  public readonly position: Vec3;

  public constructor(position: Vec3) {
    this.position = position.clone();
  }

  public project(point: Vec3, canvas: Canvas): { screenPoint: Vec2, scale: number } {
    const viewSpacePoint = Vec3.sub(point, this.position);

    const scale = canvas.logicalHeight / viewSpacePoint.z;
    const screenPoint = new Vec2(
      canvas.logicalWidth / 2 + (viewSpacePoint.x * scale),
      canvas.logicalHeight / 2 + (viewSpacePoint.y * scale),
    );

    return { screenPoint, scale };
  }
}
