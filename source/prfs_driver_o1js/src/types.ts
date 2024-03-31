import { SpartanMerkleProof } from "@taigalabs/prfs-circuit-interface/bindings/SpartanMerkleProof";

export interface ProverConfig {
  witnessGenWasm: string;
  circuit: string;
  enableProfiler?: boolean;
}

export interface VerifyConfig {
  circuit: string; // Path to circuit file compiled by Nova-Scotia
  enableProfiler?: boolean;
}

export interface PrfsHandlers {
  supportsThreads: boolean;
  poseidonHash(input: Uint8Array): Promise<Uint8Array>;
  prove(circuit: Uint8Array, vars: Uint8Array, public_inputs: Uint8Array): Promise<Uint8Array>;
  verify(
    circuit: Uint8Array,
    proof: Uint8Array | number[],
    public_inputs: Uint8Array,
  ): Promise<boolean>;
  makeMerkleProof(leaves: string[], leaf_idx: BigInt, depth: number): Promise<SpartanMerkleProof>;
  getBuildStatus(): Promise<BuildStatus>;
}

export type HashFn = (inputs: bigint[]) => bigint;

export type AsyncHashFn = (inputs: bigint[]) => Promise<bigint>;

export interface PrfsMerkleProof {
  root: bigint;
  siblings: string[];
  pathIndices: number[];
}

export interface BuildStatus {
  // wasmThreadSupport: string;
  // wasmModulePath: string;
}

export interface O1jsDriverCtorArgs {
  transactionFee: string;
  zkAppAddr: string;
}

export interface O1jsDriverProperties {
  // version: string;
  transactionFee: string;
  zkAppAddr: string;
}
