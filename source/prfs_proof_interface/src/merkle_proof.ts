// The same structure as MerkleProof in @zk-kit/incremental-merkle-tree.
// Not directly using MerkleProof defined in @zk-kit/incremental-merkle-tree so
// library users can choose whatever merkle tree management method they want.
export interface SpartanMerkleProof {
  root: bigint;
  siblings: bigint[];
  pathIndices: number[];
}
