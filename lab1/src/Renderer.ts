import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  PCFSoftShadowMap,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Renderer {
  private readonly renderer: WebGLRenderer;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;

  public constructor(canvas: HTMLCanvasElement, scene: Scene) {
    this.scene = scene;
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.25, 128);

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.maxPolarAngle = 0.46875 * Math.PI;
    controls.minDistance = 4;
    controls.maxDistance = 64;
    controls.update();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
