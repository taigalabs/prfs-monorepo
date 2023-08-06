export interface CircuitDriverGen {
  newInstance(driverProps: any): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  prove(...args: any): Promise<ProveResult>;
  verify(...args: any): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  [key: string]: any;
}

export interface ProveResult {
  proof: Uint8Array;
  publicInput: any;
}
