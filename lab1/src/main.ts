import { Mesh, BoxBufferGeometry, MeshLambertMaterial, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import BSpline from './BSpline';
import Renderer from './Renderer';
import Lab1Scene from './Lab1Scene';

import modelURL from '../assets/models/simplify_bell_x1_mesh.obj';
import splinePoints from '../assets/splines/spiral.json';

const path = new BSpline(
  splinePoints.map((coords: [number, number, number]) => new Vector3(...coords)),
);

const cubeGeometry = new BoxBufferGeometry();
const cubeMaterial = new MeshLambertMaterial();
const cube = new Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.receiveShadow = true;

const scene = new Lab1Scene(cube, path);

const canvas = document.getElementById('lab1-canvas');
if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('The canvas does not exist');
const renderer = new Renderer(canvas, scene);

window.addEventListener('resize', () => { renderer.resize(); }, false);

new OBJLoader().load(
  modelURL,
  (group) => {
    group.traverse((object) => {
      object.castShadow = true;
      object.receiveShadow = true;
    });

    scene.setAnimatedObject(group);
  },
  undefined,
  console.error,
);

let startTime = performance.now();
const render = (time: DOMHighResTimeStamp) => {
  requestAnimationFrame(render);
  const animationTime = (time - startTime) / 1000;
  const t = animationTime / 10;

  scene.update(t);
  renderer.render();

  if (t >= 1) startTime = time;
};
requestAnimationFrame(render);
