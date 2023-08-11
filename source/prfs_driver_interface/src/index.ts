export interface CircuitDriverGen {
  newInstance(driverProps: any): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  prove(args: ProveArgs): Promise<ProveResult>;
  verify(args: ProveArgs): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  [key: string]: any;
}

export interface ProveArgs {
  inputs: Record<string, any>;
  eventListener: (msg: string) => void;
}

export interface VerifyArgs {
  inputs: Record<string, any>;
}

export interface ProveResult {
  proof: Uint8Array;
  publicInput: any;
}
