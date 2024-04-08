// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { SpartanMerkleProof } from "./SpartanMerkleProof";

export type MerkleSigPosExactV1Inputs = {
  sigR: bigint;
  sigS: bigint;
  sigpos: bigint;
  leaf: bigint;
  valueRaw: string;
  valueInt: bigint;
  merkleProof: SpartanMerkleProof;
  nonceRaw: string;
  proofPubKey: string;
};
