import { PublicInputInstance } from "./prfs_circuit";

export interface PrfsProofType {
  proof_type_id: string;
  label: string;
  author: string;
  desc: string;

  circuit_id: string;
  public_inputs: PublicInputInstance;
  program_id: string;
  program_properties: Record<string, any>;

  created_at: string;
}
