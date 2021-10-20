import {
  Scene,
  Object3D,
  Mesh,
  PlaneBufferGeometry,
  TubeBufferGeometry,
  MeshLambertMaterial,
  AmbientLight,
  DirectionalLight,
  Curve,
  LineCurve3,
  Vector3,
} from 'three';

export default class Lab1Scene extends Scene {
  private animatedObject: Object3D;
  private path: Curve<Vector3>;
  private readonly tangentMesh: Mesh;

  public constructor(animatedObject: Object3D, path: Curve<Vector3>) {
    super();

    this.animatedObject = animatedObject;
    this.add(this.animatedObject);

    this.addGround();
    this.addLights();

    this.path = path;
    const pathGeometry = new TubeBufferGeometry(this.path, 4096, 0.01, 8, false);
    const pathMaterial = new MeshLambertMaterial({ color: 0xAA0000, dithering: true });
    const pathMesh = new Mesh(pathGeometry, pathMaterial);
    this.add(pathMesh);

    const tangentPath = new LineCurve3(
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 2),
    );
    const tangentGeometry = new TubeBufferGeometry(tangentPath, 1, 0.01, 8, false);
    const tangentMaterial = new MeshLambertMaterial({ color: 0xFF5555, dithering: true });
    this.tangentMesh = new Mesh(tangentGeometry, tangentMaterial);
    this.add(this.tangentMesh);
  }

  private addGround(): void {
    const groundGeometry = new PlaneBufferGeometry(25, 25, 1, 1);
    const groundMaterial = new MeshLambertMaterial({ color: 0x55FF55, dithering: true });
    const ground = new Mesh(groundGeometry, groundMaterial);
    ground.rotateX(-Math.PI / 2);
    ground.receiveShadow = true;
    this.add(ground);
  }

  private addLights(): void {
    const ambientLight = new AmbientLight(0xFFFFFF, 0.25);
    this.add(ambientLight);

    const directionalLight = new DirectionalLight(0xFFFFFF, 0.75);
    directionalLight.position.set(7.5, 15, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.lookAt(new Vector3(0, 0, 0));
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 48;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    this.add(directionalLight);
  }

  public update(t: number): void {
    const position = this.path.getPoint(t);
    this.animatedObject.position.copy(position);

    /*
     * Using `animatedObject.lookAt(tangentTarget);` would be better here.
     * However, this way of setting the rotation is required by the lab assignment.
     */
    const tangent = this.path.getTangent(t);
    const globalZ = new Vector3(0, 0, 1);
    const rotAxis = new Vector3().crossVectors(globalZ, tangent).normalize();
    const rotAngle = Math.acos(globalZ.clone().dot(tangent) / (globalZ.length() * tangent.length()));
    this.animatedObject.setRotationFromAxisAngle(rotAxis, rotAngle);

    this.tangentMesh.position.copy(position);
    const tangentTarget = position.clone().add(tangent);
    this.tangentMesh.lookAt(tangentTarget);
  }

  public setAnimatedObject(object: Object3D): void {
    this.remove(this.animatedObject);
    this.add(object);
    this.animatedObject = object;
  }

  public setPath(path: Curve<Vector3>) {
    this.path = path;
  }
}
