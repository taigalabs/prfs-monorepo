import { MembershipProver2 } from "../core/membership_prover2";
import { Poseidon } from "../helpers/poseidon";
import { Tree } from "../helpers/tree";
import { NIZK } from "../types";

export declare type PrfsWasmType = typeof import("./build/prfs_wasm");

export interface WrappedPrfs {
  poseidonHash(inputs: bigint[]): bigint;
  newTree(depth: number): Tree;
  membershshipProve: Promise<NIZK>;
}
