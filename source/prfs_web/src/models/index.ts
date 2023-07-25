export interface Circuit {
  id: number;
  label: string;
  author: string;
  num_public_inputs: number;
  desc: string;
  created_at: string;
}

export interface Set {
  set_id: number;
  label: string;
  author: string;
  desc: string;
  hash_algorithm: number;
  cardinality: number;
  created_at: string;
}
