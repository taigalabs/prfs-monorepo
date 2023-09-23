import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

export function validateForm(formValues: any, circuitInputs: CircuitInput[]) {
  for (const input of circuitInputs) {
    if (input.type === "PASSCODE_CONFIRM") {
      const val = formValues[input.name];
      const val2 = formValues[`${input.name}-confirm`];

      if (!val) {
        throw new InputError(input.name, "value does not exist");
      }

      if (!val2) {
        throw new InputError(`${input.name}-confirm`, "value does not exist");
      }

      if (val !== val2) {
        throw new InputError(`${input.name}-confirm`, "value not identical");
      }
    }
  }
}

export class InputError extends Error {
  constructor(inputName: string, err: string) {
    super(err);
    this.name = inputName;
  }
}
