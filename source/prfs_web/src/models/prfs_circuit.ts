export interface PrfsCircuit {
  circuit_id: string;
  label: string;
  author: string;
  public_inputs: PublicInput[];
  desc: string;
  created_at: string;
  proof_algorithm: string;
  arithmetization: string;
  circuit_dsl: string;
  elliptic_curve: string;
  finite_field: string;
  program: PrfsCircuitProgram;
}

export enum PublicInputType {
  PROVER_GENERATED = "PROVER_GENERATED",
  PRFS_SET = "PRFS_SET",
}

export interface PublicInput {
  label: string;
  desc: string;
  type: PublicInputType;
}

export interface PublicInputInstance {
  [key: number]: {
    label: string;
    type: PublicInputType;
    value: any;
  };
}

export interface PrfsCircuitProgram {
  program_id: string;
  program_repository_url: string;
  version: string;
  properties: {
    [key: string]: any;
  };
}
