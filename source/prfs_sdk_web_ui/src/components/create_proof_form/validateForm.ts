import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

export function validateForm(formValues: any, circuitInputs: CircuitInput[]) {
  console.log(55, formValues, circuitInputs);

  const inputCount = circuitInputs.length;
}
