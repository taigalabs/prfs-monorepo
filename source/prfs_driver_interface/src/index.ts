export interface CircuitDriver {
  newInstance(driverProps: any): Promise<CircuitDriverInstance>;
  [key: string]: any;
}

export interface CircuitDriverInstance {
  prove(...args: any): Promise<ProveResult>;
  // verify(...args: any): Promise<boolean>;
}

export interface ProveResult {
  proof: Uint8Array;
  publicInput: any;
}
