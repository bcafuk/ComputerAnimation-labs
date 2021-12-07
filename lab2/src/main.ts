import { InstancedMesh, MeshBasicMaterial, PlaneBufferGeometry, TextureLoader } from 'three';
import Renderer from './Renderer';
import Lab2Scene from './Lab2Scene';

import dropletTexture from '../assets/textures/water.png';

const maxDroplets = 8192;

const planeGeometry = new PlaneBufferGeometry();
const droplet = new TextureLoader().load(dropletTexture);
const dropletMaterial = new MeshBasicMaterial({
  alphaMap: droplet,
  transparent: true,
  color: 0xFFFFFF,
  opacity: 0.125,
  depthTest: false,
});

const droplets = new InstancedMesh(planeGeometry, dropletMaterial, maxDroplets);
const scene = new Lab2Scene(droplets, maxDroplets);

const canvas = document.getElementById('lab2-canvas');
if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('The canvas does not exist');
const renderer = new Renderer(canvas, scene);

window.addEventListener('resize', () => { renderer.resize(); }, false);

let lastTime: DOMHighResTimeStamp | null = null;
const render = (time: DOMHighResTimeStamp) => {
  requestAnimationFrame(render);

  if (lastTime === null)
    lastTime = time;

  const dt = (time - lastTime) / 1000;
  lastTime = time;

  scene.update(dt, renderer.getCamera());
  renderer.render();
};
requestAnimationFrame(render);
