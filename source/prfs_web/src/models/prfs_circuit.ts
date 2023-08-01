export interface PrfsCircuit {
  circuit_id: number;
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

export const PRFS_CIRCUIT_KEYS = [
  "circuit_id",
  "label",
  "author",
  "public_inputs",
  "desc",
  "created_at",
  "arithmetization",
  "program",
  "proof_algorithm",
  "circuit_dsl",
  "elliptic_curve",
  "finite_field",
] as const;

export type PrfsCircuitKeys = (typeof PRFS_CIRCUIT_KEYS)[number];

export enum PublicInputType {
  COMPUTED = "COMPUTED",
  PRFS_SET = "PRFS_SET",
}

export interface PublicInput {
  label: string;
  desc: string;
  type: PublicInputType;
}

export type PublicInputKeys = (typeof PUBLIC_INPUT_KEYS)[number];

export const PUBLIC_INPUT_KEYS = ["type", "label", "desc"] as const;

export const PRFS_CIRCUIT_PROGRAM_KEYS = [
  "program_id",
  "program_repository_url",
  "version",
  "properties",
] as const;

export type PrfsCircuitProgramKeys = (typeof PRFS_CIRCUIT_PROGRAM_KEYS)[number];

export interface PrfsCircuitProgram {
  program_id: string;
  program_repository_url: string;
  version: string;
  properties: {
    [key: string]: any;
  };
}
