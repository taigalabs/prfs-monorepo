import { CircuitTypeId } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeId";

import { CreateProofEvent, DriverEventListener } from "./events";

export interface CircuitDriverGen {
  newInstance(driverProps: any, eventListener: DriverEventListener): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  getArtifactCount(): number;
  prove(args: ProveArgs<any>): Promise<ProveResult>;
  verify(args: VerifyArgs): Promise<boolean>;
  getBuildStatus(): Promise<any>;
}

export interface ProveArgs<T> {
  inputs: T;
  circuitTypeId: CircuitTypeId;
  eventListener: (ev: CreateProofEvent) => void;
}

export interface VerifyArgs {
  proof: Proof;
  circuitTypeId: CircuitTypeId;
}

export interface Proof {
  proofBytes: Uint8Array | number[];
  publicInputSer: string;
  proofPubKey: string;
  ledger?: string;
  txHash?: string;
}

export interface ProveResult {
  proof: Proof;
  duration: number;
}

export interface ProofActionPayload {
  proofAction: string;
  proofActionSigMsg: Uint8Array | number[];
  proofActionSig: string;
}

// export type ProveReceipt = ProveResult & ProofActionPayload;

export type ProveReceipt = {
  type: "prove_receipt";
  // proofPubKey: string;
} & ProveResult &
  ProofActionPayload;

export type CachedProveReceipt = {
  type: "cached_prove_receipt";
  proofPubKey: string;
} & ProofActionPayload;

export type GenericProveReceipt = ProveReceipt | CachedProveReceipt;

export interface VerifyReceipt {
  verifyResult: boolean;
  error?: string;
}

export interface ProofPublicInput {
  circuitPubInput: Record<string, any>;
  [key: string]: any;
}

export type Uint8ArrayNative = number[];
