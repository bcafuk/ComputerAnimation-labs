import Canvas from './display/Canvas';
import Game from './Game';
import ControlMapper from './input/ControlMapper';
import Controls from './input/Controls';
import Keyboard from './input/Keyboard';
import GamepadInput from './input/GamepadInput';
import AxisFlags from './input/AxisFlags';
import Vec2 from './math/Vec2';
import Track from './gameObjects/Track';

const canvasID = 'racing-canvas';
const canvasElement = document.getElementById(canvasID);
if (canvasElement === null) throw new Error(`Could not an element with the ID ${canvasID}`);
if (!(canvasElement instanceof HTMLCanvasElement)) throw new Error(`The element with ID ${canvasID} is not a canvas element`);

const logicalResolution = { width: 1920 / 5, height: 1080 / 5 };
const canvas = new Canvas(canvasElement, logicalResolution.width, logicalResolution.height);

const input = new ControlMapper<Controls>();

const keyboard = new Keyboard();
input.addBinding(Controls.ACCELERATE, keyboard, 'KeyW');
input.addBinding(Controls.BRAKE, keyboard, 'KeyS');
input.addBinding(Controls.STEER_LEFT, keyboard, 'KeyA');
input.addBinding(Controls.STEER_RIGHT, keyboard, 'KeyD');

window.addEventListener('gamepadconnected', (event) => {
  const gamepad = new GamepadInput((event as GamepadEvent).gamepad);
  input.addBinding(
    Controls.ACCELERATE, gamepad,
    [2, new Set([AxisFlags.normalized, AxisFlags.inverted])],
  );
  input.addBinding(
    Controls.BRAKE, gamepad,
    [5, new Set([AxisFlags.normalized, AxisFlags.inverted])],
  );
  input.addBinding(Controls.STEERING, gamepad, [0, new Set()]);
});

const track = new Track(
  520,
  [
    [0, new Vec2(0, 0)],
    [64, new Vec2(-0.03, 0)],
    [80, new Vec2(0.03, 0)],
    [96, new Vec2(0, 0)],
    [110, new Vec2(0.01, 0)],
    [115, new Vec2(0.005, 0)],
    [130, new Vec2(0, 0)],
    [150, new Vec2(0.02, 0)],
    [195, new Vec2(0.01, 0)],
    [200, new Vec2(-0.005, 0)],
    [240, new Vec2(-0.01, 0)],
    [270, new Vec2(-0.02, 0)],
    [275, new Vec2(-0.01, 0)],
    [300, new Vec2(0, 0)],
    [400, new Vec2(0.1, 0)],
    [405, new Vec2(0.05, 0)],
    [425, new Vec2(0.0, 0)],
    [480, new Vec2(-0.04, 0)],
    [490, new Vec2(-0.08, 0)],
    [495, new Vec2(-0.04, 0)],
  ],
);

const racingGame = new Game(canvas, input, track);
racingGame.run();
