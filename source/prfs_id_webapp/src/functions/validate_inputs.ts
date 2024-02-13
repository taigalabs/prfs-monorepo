import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { SimpleHashV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Inputs";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

export function validateInputs(
  formValues: Record<string, any>,
  proofType: PrfsProofType,
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
): boolean {
  const formErrors: Record<string, string> = {};
  let hasError = false;

  switch (proofType.circuit_type_id) {
    case "merkle_sig_pos_range_v1": {
      const val = formValues as AddrMembershipV1Inputs | undefined;

      if (!val?.merkleProof) {
        hasError = true;
        formErrors.merkleProof = "Input is empty";
      } else {
        const { root, siblings, pathIndices } = val.merkleProof;

        if (!root || !siblings || !pathIndices) {
          hasError = true;
          formErrors.merkleProof = "Merkle path is not provided. Have you put address?";
        }
      }

      if (!val?.sigData) {
        hasError = true;
        formErrors.sigData = "Input is empty";
      } else {
        const { sig, msgHash, msgRaw } = val.sigData;

        if (!sig || !msgHash || !msgRaw) {
          hasError = true;
          formErrors.sigData = "Signature is not provided. Have you signed?";
        }
      }
      break;
    }
    case "simple_hash_v1": {
      const val = formValues as SimpleHashV1Inputs | undefined;

      if (!val?.hashData) {
        hasError = true;
        formErrors.hashData = "Input is invalid";
      } else {
        const { msgRaw, msgRawInt, msgHash } = val.hashData;

        if (!msgRaw || !msgRawInt || !msgHash) {
          hasError = true;
          formErrors.hashData = "Hashed outcome should be provided. Have you hashed the input?";
        }
      }
      break;
    }
    case "addr_membership_v1": {
      break;
    }
    default: {
      console.error("Not supported circuit type");
      return false;
    }
  }
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
    return false;
  }
  return true;
}

export class InputError extends Error {
  constructor(inputName: string, err: string) {
    super(err);
    this.name = inputName;
  }
}
