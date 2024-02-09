import { SigData } from "../sig_data";
import { SpartanMerkleProof } from "../merkle_proof";

export interface MembershipProveInputs {
  sigData: SigData;
  merkleProof: SpartanMerkleProof;
}

export interface SimpleHashProveArgs {
  hashData: {
    msgRaw: string;
    msgRawInt: bigint;
    msgHash: bigint;
  };
}
