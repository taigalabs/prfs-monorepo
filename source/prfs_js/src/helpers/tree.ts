import { AsyncIncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { Poseidon } from "./poseidon";
import { MerkleProof, HashFn } from "../types";
import { bytesToBigInt } from "./utils";

export class Tree {
  depth: number;
  // poseidon: Poseidon;
  private treeInner!: AsyncIncrementalMerkleTree;

  constructor(depth: number, hashFunction: HashFn) {
    this.depth = depth;

    // this.poseidon = poseidon;
    // const hash = poseidon.hash.bind(poseidon);

    this.treeInner = AsyncIncrementalMerkleTree.newInstance(
      hashFunction,
      this.depth,
      BigInt(0)
    );
  }

  async insert(leaf: bigint) {
    await this.treeInner.insert(leaf);
  }

  async delete(index: number) {
    await this.treeInner.delete(index);
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

    const siblings = proof.siblings.map((s: any) => {
      console.log(111, s);

      return typeof s[0] === "bigint" ? s : bytesToBigInt(s[0])
    });

    return {
      siblings,
      pathIndices: proof.pathIndices,
      root: proof.root
    };
  }

  // TODO: Add more functions that expose the IncrementalMerkleTree API
}
