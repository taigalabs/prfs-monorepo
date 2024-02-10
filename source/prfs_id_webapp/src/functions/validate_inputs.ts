import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

export async function validateInputs(
  formValues: Record<string, any>,
  proofType: PrfsProofType,
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>,
): Promise<Record<string, any> | null> {
  const formErrors: Record<string, string> = {};

  let hasError = false;
  // for (const input of proofType.circuit_inputs) {
  //   switch (input.type as CircuitInputType) {
  //     case "MERKLE_PROOF_1": {
  //       const val: SpartanMerkleProof | undefined = formValues[input.name];

  //       if (!val) {
  //         hasError = true;
  //         formErrors[input.name] = "Input is empty";
  //       } else {
  //         const { root, siblings, pathIndices } = val;

  //         if (!root || !siblings || !pathIndices) {
  //           hasError = true;
  //           formErrors[input.name] = "Merkle path is not provided. Have you put address?";
  //         }
  //       }

  //       break;
  //     }

  //     case "SIG_DATA_1": {
  //       const val: SigData | undefined = formValues[input.name];

  //       if (!val) {
  //         hasError = true;
  //         formErrors[input.name] = "Input is empty";
  //       } else {
  //         const { sig, msgHash, msgRaw } = val;

  //         if (!sig || !msgHash || !msgRaw) {
  //           hasError = true;
  //           formErrors[input.name] = "Signature is not provided. Have you signed?";
  //         }
  //       }

  //       break;
  //     }

  //     case "HASH_DATA_1": {
  //       const val: HashData | undefined = formValues[input.name];

  //       if (!val) {
  //         hasError = true;
  //         formErrors[input.name] = "Input is invalid";
  //       } else {
  //         const { msgRaw, msgRawInt, msgHash } = val;

  //         if (!msgRaw || !msgRawInt || !msgHash) {
  //           hasError = true;
  //           formErrors[input.name] =
  //             "Hashed outcome should be provided. Have you hashed the input?";
  //         }
  //       }

  //       break;
  //     }

  //     case "MERKLE_SIG_POS_RANGE_V1": {
  //       const val: SpartanMerkleProof | undefined = formValues[input.name];

  //       if (!val) {
  //         hasError = true;
  //         formErrors[input.name] = "Input is empty";
  //       } else {
  //         const { root, siblings, pathIndices } = val;

  //         if (!root || !siblings || !pathIndices) {
  //           hasError = true;
  //           formErrors[input.name] = "Merkle path is not provided. Have you put address?";
  //         }
  //       }

  //       break;
  //     }

  //     default: {
  //       hasError = true;
  //       formErrors[input.name] = `Invalid input type type: ${input.type}`;
  //       break;
  //     }
  //   }
  // }

  if (hasError) {
    setFormErrors(formErrors);
    return null;
  }

  return formValues;
}

export class InputError extends Error {
  constructor(inputName: string, err: string) {
    super(err);
    this.name = inputName;
  }
}
