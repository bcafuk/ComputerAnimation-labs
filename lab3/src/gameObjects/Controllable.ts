import InputDevice from '../input/InputDevice';

export default interface Controllable<ControlKey> {
  processInputs(dt: number, input: InputDevice<ControlKey>): void;
}
