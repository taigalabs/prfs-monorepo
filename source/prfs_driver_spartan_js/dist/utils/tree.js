import { AsyncIncrementalMerkleTree } from "@taigalabs/incremental-merkle-tree2";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";
export class Tree {
    depth;
    treeInner;
    constructor(depth, treeInner) {
        this.depth = depth;
        this.treeInner = treeInner;
    }
    static async newInstance(depth, hashFunction) {
        let treeInner = await AsyncIncrementalMerkleTree.newInstance(hashFunction, depth, BigInt(0));
        return new Tree(depth, treeInner);
    }
    async insert(leaf) {
        await this.treeInner.insert(leaf);
    }
    async delete(index) {
        await this.treeInner.delete(index);
    }
    leaves() {
        return this.treeInner.leaves;
    }
    root() {
        return this.treeInner.root;
    }
    indexOf(leaf) {
        return this.treeInner.indexOf(leaf);
    }
    createProof(index) {
        const proof = this.treeInner.createProof(index);
        const siblings = proof.siblings.map((s) => {
            return typeof s[0] === "bigint" ? s : bytesToBigInt(s[0]);
        });
        return {
            siblings,
            pathIndices: proof.pathIndices,
            root: proof.root,
        };
    }
}
