// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { SpartanMerkleProof } from "./SpartanMerkleProof";

export type MerkleSigPosRangeV1Inputs = {
  sigR: bigint;
  sigS: bigint;
  sigpos: bigint;
  leaf: bigint;
  assetSize: bigint;
  assetSizeGreaterEqThan: bigint;
  assetSizeLessThan: bigint;
  assetSizeLabel: string;
  merkleProof: SpartanMerkleProof;
  nonceRaw: string;
  proofPubKey: string;
};
