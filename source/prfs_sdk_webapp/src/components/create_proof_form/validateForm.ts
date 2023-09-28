import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ethers } from "ethers";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

export async function validateForm(formValues: any, circuitInputs: CircuitInput[]) {
  const newFormValues: Record<string, any> = {};

  for (const input of circuitInputs) {
    switch (input.type) {
      case "PASSCODE": {
        const val = formValues[input.name];
        const prfs_pw_msg = `PRFS_PW_${val}`;
        const pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        const { sig } = await sendMsgToParent(
          new Msg("GET_SIGNATURE", {
            msgRaw: pw_hash,
          })
        );

        newFormValues[input.name] = sig;
        break;
      }
      case "PASSCODE_CONFIRM": {
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

        const prfs_pw_msg = `PRFS_PW_${val}`;
        const pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        const { sig } = await sendMsgToParent(
          new Msg("GET_SIGNATURE", {
            msgRaw: pw_hash,
          })
        );

        newFormValues[input.name] = sig;

        break;
      }
      default:
        newFormValues[input.name] = formValues[input.name];
    }
  }

  return newFormValues;
}

export class InputError extends Error {
  constructor(inputName: string, err: string) {
    super(err);
    this.name = inputName;
  }
}
