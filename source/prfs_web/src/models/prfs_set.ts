export interface PrfsSet {
  set_id: string;
  label: string;
  author: string;
  desc: string;
  hash_algorithm: string;
  cardinality: number;
  created_at: string;
  merkle_root: string;
  element_type: string;
  elliptic_curve: string;
  finite_field: string;
}
