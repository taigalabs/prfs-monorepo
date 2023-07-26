export interface PrfsCircuit {
  circuit_id: number;
  label: string;
  author: string;
  num_public_inputs: number;
  desc: string;
  created_at: string;
  proof_algorithm: string;
  arithmetization: string;
  circuit_dsl: string;
  elliptic_curve: string;
  finite_field: string;
}

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

export interface PrfsTreeNode {
  pos_h: number;
  pos_w: number;
  val: string;
  set_id: string;
}
