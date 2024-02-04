import { SpartanMerkleProof } from "../merkle_proof";

export interface MerklePosRangeInputs {
  leaf: bigint;
  merkleProof: SpartanMerkleProof;
}
