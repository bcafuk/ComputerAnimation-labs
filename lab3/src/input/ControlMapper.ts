import InputDevice from './InputDevice';

type DeviceControlPair<InputKey> = {
  device: InputDevice<InputKey>,
  inputKey: InputKey,
};

export default class ControlMapper<ControlKey> implements InputDevice<ControlKey> {
  private readonly controlBindings: Map<ControlKey, Set<DeviceControlPair<unknown>>> = new Map();

  public addBinding<InputKey>(
    control: ControlKey,
    device: InputDevice<InputKey>,
    inputKey: InputKey,
  ): void {
    let bindingSet = this.controlBindings.get(control);

    if (bindingSet === undefined) {
      bindingSet = new Set<DeviceControlPair<unknown>>();
      this.controlBindings.set(control, bindingSet);
    }

    bindingSet.add({ device, inputKey });
  }

  public getInput(controlKey: ControlKey): number {
    const bindingSet = this.controlBindings.get(controlKey);

    if (bindingSet === undefined || bindingSet.size === 0) return 0;

    return Math.max(...[...bindingSet].map(({ device, inputKey }) => device.getInput(inputKey)));
  }
}
