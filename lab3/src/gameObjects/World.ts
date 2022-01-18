import Renderable from './Renderable';
import Canvas from '../display/Canvas';
import Camera from '../display/Camera';
import Vec3 from '../math/Vec3';
import mapRange from '../math/mapRange';
import mod from '../math/mod';
import Vec2 from '../math/Vec2';
import Track from './Track';

export default class World implements Renderable {
  private static readonly maxSegmentsShown = 47;

  private readonly track: Track;

  public constructor(track: Track) {
    this.track = track;
  }

  public render(canvas: Canvas, camera: Camera): void {
    canvas.setFillStyle('#639bff');
    canvas.fillRect(0, 0, canvas.logicalWidth, canvas.logicalHeight);

    const roadWidth = 2;

    const zFraction = mod(camera.position.z, 1);
    const firstSegment = Math.floor(camera.position.z + 1);

    const offsetVelocity = Vec2.mulScalar(this.track.getCurveAt(firstSegment), -zFraction);
    const offset = Vec2.mulScalar(offsetVelocity, -1);

    let yMax = canvas.logicalHeight;
    for (
      let segmentIndex = firstSegment;
      segmentIndex < firstSegment + World.maxSegmentsShown;
      segmentIndex += 1
    ) {
      const offsetAcceleration = this.track.getCurveAt(segmentIndex);

      const bottomOffset = offset.clone();
      offset.add(offsetVelocity);
      offsetVelocity.add(offsetAcceleration);
      const topOffset = offset;

      const { screenPoint: roadTop, scale: scaleTop } = camera.project(
        new Vec3(topOffset.x, topOffset.y, segmentIndex + 1),
        canvas,
      );

      if (Math.round(roadTop.y) >= yMax) continue;

      const { screenPoint: roadBottom, scale: scaleBottom } = camera.project(
        new Vec3(bottomOffset.x, bottomOffset.y, segmentIndex),
        canvas,
      );

      const segmentHeight = roadBottom.y - roadTop.y;

      if (segmentHeight < 0.125) continue;

      for (let y = Math.round(roadTop.y); y < yMax && y < roadBottom.y; y += 1) {
        const x1 = Math.round(mapRange(
          y,
          roadTop.y,
          roadBottom.y,
          roadTop.x - scaleTop * roadWidth,
          roadBottom.x - scaleBottom * roadWidth,
        ));

        const x2 = Math.round(mapRange(
          y,
          roadTop.y,
          roadBottom.y,
          roadTop.x + scaleTop * roadWidth,
          roadBottom.x + scaleBottom * roadWidth,
        ));

        const scale = mapRange(
          y,
          roadTop.y,
          roadBottom.y,
          scaleTop,
          scaleBottom,
        );

        World.drawScanline(
          canvas,
          segmentIndex % this.track.length,
          x1,
          x2,
          y,
          scale,
          segmentHeight,
        );
      }

      yMax = Math.round(roadTop.y);
    }
  }

  private static drawScanline(
    canvas: Canvas,
    segmentIndex: number,
    x1: number,
    x2: number,
    y: number,
    scale: number,
    segmentHeight: number,
  ) {
    const drawStriped = segmentHeight >= 0.25;

    // Grass
    if (drawStriped && segmentIndex % 8 < 4) {
      canvas.setFillStyle('#99e550');
    } else {
      canvas.setFillStyle('#6abe30');
    }

    canvas.fillRect(0, y, canvas.logicalWidth, 1);

    // Road
    if (segmentIndex === 0) {
      // Finish line
      canvas.setFillStyle('#9badb7');
    } else if (drawStriped && segmentIndex % 8 < 4) {
      canvas.setFillStyle('#696a6a');
    } else {
      canvas.setFillStyle('#595652');
    }

    canvas.fillRect(x1, y, x2 - x1, 1);

    // Rumble strips
    if (segmentHeight >= 0.5) {
      if (drawStriped && segmentIndex % 2 === 0) {
        canvas.setFillStyle('#ac3232');
      } else {
        canvas.setFillStyle('#ffffff');
      }

      const rumbleWidth = Math.floor(scale / 5);
      canvas.fillRect(x1 - rumbleWidth, y, rumbleWidth, 1);
      canvas.fillRect(x2, y, rumbleWidth, 1);
    }

    // Lane divider stripes
    if (drawStriped && segmentIndex % 4 >= 1 && segmentIndex % 4 < 3) {
      const xCenter = Math.round((x1 + x2) / 2);
      const stripeHalfWidth = Math.round(scale / 16);

      canvas.setFillStyle('#ffffff');
      canvas.fillRect(xCenter - stripeHalfWidth, y, stripeHalfWidth * 2, 1);
      canvas.fillRect(Math.round((x1 * 3 + x2) / 4) - stripeHalfWidth, y, stripeHalfWidth * 2, 1);
      canvas.fillRect(Math.round((x1 + x2 * 3) / 4) - stripeHalfWidth, y, stripeHalfWidth * 2, 1);
    }
  }
}
