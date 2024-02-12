// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export interface CreatePrfsProofTypeRequest {
  proof_type_id: string;
  author: string;
  label: string;
  desc: string;
  circuit_id: string;
  circuit_type_id: "simple_hash_v1" | "addr_membership_2v1" | "merkle_sig_pos_range_v1";
  circuit_type_data: Record<string, any>;
  circuit_driver_id: "spartan_circom_v1";
  expression: string;
  img_url: string | null;
  img_caption: string | null;
  driver_properties: Record<string, string>;
}
