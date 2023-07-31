export interface PrfsCircuit {
  circuit_id: number;
  label: string;
  author: string;
  public_inputs: {
    label: string;
    desc: string;
    type: PublicInputType;
  }[];
  desc: string;
  created_at: string;
  proof_algorithm: string;
  arithmetization: string;
  circuit_dsl: string;
  elliptic_curve: string;
  finite_field: string;
}

export enum PublicInputType {
  COMPUTED = "COMPUTED",
  PRFS_SET = "PRFS_SET",
}

export const PRFS_CIRCUIT_KEYS = [
  "circuit_id",
  "label",
  "author",
  "public_inputs",
  "desc",
  "created_at",
  "arithmetization",
  "proof_algorithm",
  "circuit_dsl",
  "elliptic_curve",
  "finite_field",
] as const;

export type PrfsCircuitKeys = (typeof PRFS_CIRCUIT_KEYS)[number];

export interface PrfsSet {
  set_id: number;
  label: string;
  author: string;
  desc: string;
  hash_algorithm: number;
  cardinality: number;
  created_at: string;
  merkle_root: string;
  element_type: string;
  elliptic_curve: string;
  finite_field: string;
}

export const PRFS_SET_KEYS = [
  "set_id",
  "label",
  "author",
  "desc",
  "hash_algorithm",
  "elliptic_curve",
  "finite_field",
  "element_type",
  "cardinality",
  "created_at",
  "merkle_root",
] as const;

export type PrfsSetKeys = (typeof PRFS_SET_KEYS)[number];

export interface PrfsTreeNode {
  pos_h: number;
  pos_w: number;
  val: string;
  set_id: string;
}

export type PublicInputKeys = (typeof PUBLIC_INPUT_KEYS)[number];

export const PUBLIC_INPUT_KEYS = ["type", "label", "desc"] as const;
