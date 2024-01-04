import { SpartanMerkleProof } from "@taigalabs/prfs-proof-interface";
import { AsyncHashFn } from "../types";
export declare class Tree {
    depth: number;
    private treeInner;
    private constructor();
    static newInstance(depth: number, hashFunction: AsyncHashFn): Promise<Tree>;
    insert(leaf: bigint): Promise<void>;
    delete(index: number): Promise<void>;
    leaves(): bigint[];
    root(): bigint;
    indexOf(leaf: bigint): number;
    createProof(index: number): SpartanMerkleProof;
}
