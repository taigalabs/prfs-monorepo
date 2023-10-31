export * from "./types";

export interface DriverEvent {
  type: DriverEventType;
  payload: any;
}

export type DriverEventListener = (ev: DriverEvent) => void;

export interface CircuitDriverGen {
  newInstance(driverProps: any, eventListener: DriverEventListener): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  prove(args: ProveArgs<any>): Promise<ProveReceipt>;
  verify(args: VerifyArgs): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  hash(args: bigint[]): Promise<bigint>;
}

export interface ProveArgs<T> {
  inputs: T;
  circuitTypeId: string;
  eventListener: (ev: DriverEvent) => void;
}

export interface VerifyArgs {
  proveResult: {
    proof: Uint8Array;
    publicInputSer: string;
  };
  circuitTypeId: string;
}

export interface ProveResult {
  proof: Uint8Array;
  publicInputSer: string;
}

export interface ProveReceipt {
  proveResult: ProveResult;
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

export type DriverEventType = "CREATE_PROOF_EVENT" | "VERIFY_PROOF_EVENT" | "LOAD_DRIVER_EVENT";
