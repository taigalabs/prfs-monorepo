import { PublicInput } from "@taigalabs/prfs-js";

export interface PrfsProofType {
  proof_type_id: number;
  label: string;
  author: string;
  desc: string;

  circuit_id: string;
  program_id: string;
  public_inputs: PublicInput[];

  created_at: string;
}
