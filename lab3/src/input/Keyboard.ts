import InputDevice from './InputDevice';

export default class Keyboard implements InputDevice<string> {
  private readonly heldKeys: Set<string> = new Set();

  public constructor() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.heldKeys.add(event.code);
    });
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this.heldKeys.delete(event.code);
    });
  }

  public getInput(inputKey: string): number {
    return this.heldKeys.has(inputKey) ? 1.0 : 0.0;
  }
}
