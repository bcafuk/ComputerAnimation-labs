import requireNonNull from '../utils/requireNonNull';
import Vec2 from '../math/Vec2';

export default class Canvas {
  private readonly pageCanvasContext: CanvasRenderingContext2D;
  private readonly bufferCanvasContext: CanvasRenderingContext2D;

  public constructor(pageCanvas: HTMLCanvasElement, logicalWidth: number, logicalHeight: number) {
    this.pageCanvasContext = requireNonNull(
      pageCanvas.getContext('2d', { alpha: false }),
      'Could not get the context for the page canvas. Is the canvas already being used?',
    );
    this.resizePageCanvas();

    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = logicalWidth;
    bufferCanvas.height = logicalHeight;
    this.bufferCanvasContext = requireNonNull(
      bufferCanvas.getContext('2d'),
      'Could not get the context for the buffer canvas.',
    );
    this.bufferCanvasContext.imageSmoothingEnabled = false;
  }

  public get logicalWidth(): number { return this.bufferCanvasContext.canvas.width; }

  public get logicalHeight(): number { return this.bufferCanvasContext.canvas.height; }

  private resizePageCanvas() {
    this.pageCanvasContext.canvas.width = this.pageCanvasContext.canvas.clientWidth;
    this.pageCanvasContext.canvas.height = this.pageCanvasContext.canvas.clientHeight;
    this.pageCanvasContext.imageSmoothingEnabled = false;
  }

  public display(): void {
    const pageCanvas = this.pageCanvasContext.canvas;

    if (
      pageCanvas.width !== pageCanvas.clientWidth
      || pageCanvas.height !== pageCanvas.clientHeight
    ) {
      this.resizePageCanvas();
    }

    const scale = Math.min(
      pageCanvas.width / this.logicalWidth,
      pageCanvas.height / this.logicalHeight,
    );
    const physicalWidth = Math.round(this.logicalWidth * scale);
    const physicalHeight = Math.round(this.logicalHeight * scale);
    const offsetX = Math.floor((pageCanvas.width - physicalWidth) / 2);
    const offsetY = Math.floor((pageCanvas.height - physicalHeight) / 2);

    this.pageCanvasContext.fillStyle = 'black';
    this.pageCanvasContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    this.pageCanvasContext.drawImage(
      this.bufferCanvasContext.canvas,
      offsetX,
      offsetY,
      physicalWidth,
      physicalHeight,
    );
  }

  public setFillStyle(fillStyle: string | CanvasGradient | CanvasPattern): void {
    this.bufferCanvasContext.fillStyle = fillStyle;
  }

  public fillRect(x: number, y: number, width: number, height: number): void {
    this.bufferCanvasContext.fillRect(x, y, width, height);
  }

  public drawImage(
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this.bufferCanvasContext.drawImage(image, x, y, width, height);
  }

  public drawImagePart(
    image: CanvasImageSource,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destX: number,
    destY: number,
    destWidth: number,
    destHeight: number,
  ): void {
    this.bufferCanvasContext.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight,
    );
  }

  public fillPolygon(
    points: readonly Vec2[],
    fillRule?: CanvasFillRule,
  ): void {
    if (points.length === 0) return;

    this.bufferCanvasContext.beginPath();
    this.bufferCanvasContext.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      this.bufferCanvasContext.lineTo(points[i].x, points[i].y);
    }

    this.bufferCanvasContext.closePath();
    this.bufferCanvasContext.fill(fillRule);
  }

  public drawText(string: string, x: number, y: number): void {
    this.bufferCanvasContext.fillText(string, x, y);
  }
}
