import { PublicInputInstance } from "./prfs_circuit";

export interface PrfsProofType {
  proof_type_id: string;
  label: string;
  author: string;
  desc: string;

  circuit_id: string;
  program_id: string;
  public_inputs: PublicInputInstance;

  created_at: string;
}
