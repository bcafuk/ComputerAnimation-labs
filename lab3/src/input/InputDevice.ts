export default interface InputDevice<InputKey> {
  getInput(inputKey: InputKey): number;
}
