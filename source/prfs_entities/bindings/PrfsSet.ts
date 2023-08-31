// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PrfsSetType } from "./PrfsSetType";

export interface PrfsSet {
  set_id: string;
  set_type: PrfsSetType;
  label: string;
  author: string;
  desc: string;
  hash_algorithm: string;
  tree_depth: number;
  cardinality: bigint;
  merkle_root: string;
  element_type: string;
  finite_field: string;
  elliptic_curve: string;
  created_at: number;
}
