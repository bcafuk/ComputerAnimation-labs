import Canvas from '../display/Canvas';
import Camera from '../display/Camera';

export default interface Renderable {
  render(canvas: Canvas, camera: Camera): void;
}
