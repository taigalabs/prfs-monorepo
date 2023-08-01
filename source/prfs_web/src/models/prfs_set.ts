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
