import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { Poseidon } from "./poseidon";
import { MerkleProof } from "../types";
import { bytesToBigInt } from "./utils";

export class Tree {
  depth: number;
  poseidon: Poseidon;
  private treeInner!: IncrementalMerkleTree;

  constructor(depth: number, poseidon: Poseidon) {
    this.depth = depth;

    this.poseidon = poseidon;
    const hash = poseidon.hash.bind(poseidon);
    this.treeInner = new IncrementalMerkleTree(hash, this.depth, BigInt(0));
  }

  insert(leaf: bigint) {
    this.treeInner.insert(leaf);
  }

  delete(index: number) {
    this.treeInner.delete(index);
  }

  leaves(): bigint[] {
    return this.treeInner.leaves;
  }

  root(): bigint {
    return this.treeInner.root;
  }

  indexOf(leaf: bigint): number {
    return this.treeInner.indexOf(leaf);
  }

  createProof(index: number): MerkleProof {
    const proof = this.treeInner.createProof(index);

    const siblings = proof.siblings.map(s =>
      typeof s[0] === "bigint" ? s : bytesToBigInt(s[0])
    );

    return {
      siblings,
      pathIndices: proof.pathIndices,
      root: proof.root
    };
  }

  // TODO: Add more functions that expose the IncrementalMerkleTree API
}
