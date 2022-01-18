import Vec2 from '../math/Vec2';
import upperBound from '../utils/upperBound';

export default class Track {
  public readonly length: number;
  private readonly curveChanges: [number, Vec2][];

  public constructor(length: number, curveChanges: [number, Vec2][]) {
    this.length = length;
    this.curveChanges = curveChanges.sort((a, b) => a[0] - b[0]);
  }

  public getCurveAt(z: number): Vec2 {
    let curveIndex = upperBound(
      this.curveChanges,
      (change) => (z % this.length) < change[0],
    ) - 1;

    if (curveIndex < 0) curveIndex = 0;

    return this.curveChanges[curveIndex][1];
  }
}
