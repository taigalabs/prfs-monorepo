import { CreateProofEvent, DriverEvent, DriverEventListener } from "./events";

export * from "./types";
export * from "./events";

export interface CircuitDriverGen {
  newInstance(driverProps: any, eventListener: DriverEventListener): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  getArtifactCount(): number;
  prove(args: ProveArgs<any>): Promise<ProveReceipt>;
  verify(args: VerifyArgs): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  hash(args: bigint[]): Promise<bigint>;
}

export interface ProveArgs<T> {
  inputs: T;
  circuitTypeId: string;
  eventListener: (ev: CreateProofEvent) => void;
}

export interface VerifyArgs {
  proof: {
    proofBytes: Uint8Array;
    publicInputSer: string;
  };
  circuitTypeId: string;
}

export interface Proof {
  proofBytes: Uint8Array;
  publicInputSer: string;
}

export interface ProveReceipt {
  proof: Proof;
  duration: number;
}

export interface VerifyReceipt {
  verifyResult: boolean;
  error?: string;
}

export interface ProofPublicInput {
  circuitPubInput: Record<string, any>;
  [key: string]: any;
}
