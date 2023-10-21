export type * from "./types";

export interface CircuitDriverGen {
  newInstance(driverProps: any): Promise<CircuitDriver>;
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
  eventListener: (type: LogEventType, msg: string) => void;
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

export type LogEventType = "debug" | "info";
