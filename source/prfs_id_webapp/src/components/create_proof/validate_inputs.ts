import { AddrMembershipV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/AddrMembershipV1Inputs";
import { HashData } from "@taigalabs/prfs-circuit-interface/bindings/HashData";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
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
      const val = formValues as MerkleSigPosRangeV1Inputs | undefined;

      if (!val?.merkleProof) {
        hasError = true;
        formErrors.merkleProof = "Input is invalid";
      } else {
        const { root, siblings, pathIndices } = val.merkleProof;

        if (!root || !siblings || !pathIndices) {
          hasError = true;
          formErrors.merkleProof = "Merkle path is not provided. Have you put address?";
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
    default: {
      console.error("Not supported circuit type");
      return false;
    }
  }

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
