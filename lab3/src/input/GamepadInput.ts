import InputDevice from './InputDevice';
import AxisFlags from './AxisFlags';

export default class GamepadInput implements InputDevice<[number, Set<AxisFlags>]> {
  private readonly gamepad: Gamepad;

  public constructor(gamepad: Gamepad) {
    this.gamepad = gamepad;
  }

  public getInput(inputKey: [number, Set<AxisFlags>]): number {
    let axisValue = this.gamepad.axes[inputKey[0]];

    if (inputKey[1].has(AxisFlags.normalized)) {
      axisValue = (1 + axisValue) / 2;
    }
    if (inputKey[1].has(AxisFlags.inverted)) {
      axisValue = 1 - axisValue;
    }

    return axisValue;
  }
}
