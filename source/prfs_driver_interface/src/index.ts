export interface CircuitDriverGen {
  newInstance(driverProps: any): Promise<CircuitDriver>;
  [key: string]: any;
}

export interface CircuitDriver {
  prove(args: ProveArgs<any>): Promise<ProveResult>;
  verify(args: ProveArgs<any>): Promise<boolean>;
  getBuildStatus(): Promise<any>;
  serializePublicInputs(publicInputs: any): string;
  deserializePublicInputs(serPublicInputs: string): any;
  [key: string]: any;
}

export interface ProveArgs<T> {
  inputs: T;
  circuitType: string;
  eventListener: (msg: string) => void;
}

export interface VerifyArgs {
  inputs: Record<string, any>;
}

export interface ProveResult {
  proof: Uint8Array;
  publicInputs: any;
}
