export interface CircuitDriverGen {
  newInstance(driverProps: any): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  prove(args: ProveArgs<any>): Promise<ProveReceipt>;
  verify(args: VerifyArgs): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  [key: string]: any;
}

export interface ProveArgs<T> {
  inputs: T;
  circuitType: string;
  eventListener: (type: string, msg: string) => void;
}

export interface VerifyArgs {
  inputs: {
    proof: Uint8Array;
    publicInputSer: string;
  };
}

export interface ProveResult {
  proof: Uint8Array;
  publicInputSer: string;
}

export interface ProveReceipt {
  proveResult: ProveResult;
  duration: number;
}
