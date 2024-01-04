import { AsyncIncrementalMerkleTree } from "@taigalabs/async-incremental-merkle-tree";
import { SpartanMerkleProof } from "@taigalabs/prfs-proof-interface";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";

import { AsyncHashFn } from "@/types";

export class Tree {
  depth: number;
  private treeInner!: AsyncIncrementalMerkleTree;

  private constructor(depth: number, treeInner: AsyncIncrementalMerkleTree) {
    this.depth = depth;
    this.treeInner = treeInner;
  }

  public static async newInstance(depth: number, hashFunction: AsyncHashFn): Promise<Tree> {
    let treeInner = await AsyncIncrementalMerkleTree.newInstance(hashFunction, depth, BigInt(0));

    return new Tree(depth, treeInner);
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

  createProof(index: number): SpartanMerkleProof {
    const proof = this.treeInner.createProof(index);

    const siblings = proof.siblings.map((s: any) => {
      return typeof s[0] === "bigint" ? s : bytesToBigInt(s[0]);
    });

    return {
      siblings,
      pathIndices: proof.pathIndices,
      root: proof.root,
    };
  }

  // TODO: Add more functions that expose the IncrementalMerkleTree API
}
