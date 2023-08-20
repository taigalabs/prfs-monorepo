import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface CreatePrfsProofTypeRequest {
  label: string;
  desc: string;
  author: string;
  proof_type_id: string;
  circuit_id: string;
  circuit_inputs: Record<string, CircuitInput>;
  expression: string;
  img_url: string | null;
  driver_id: string;
  driver_properties: Record<string, any>;
}

export type CreatePrfsProofTypeResponse = PrfsApiResponse<{}>;

export async function createPrfsProofType(req: CreatePrfsProofTypeRequest) {
  try {
    let resp: CreatePrfsProofTypeResponse = await api({
      path: `create_prfs_proof_type`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}

export interface GetPrfsProofTypesRequest {
  page: number;
  proof_type_id?: string;
}

export type GetPrfsProofTypesResponse = PrfsApiResponse<{
  page: number;
  prfs_proof_types: PrfsProofType[];
}>;

export async function getPrfsProofTypes(req: GetPrfsProofTypesRequest) {
  try {
    let resp: GetPrfsProofTypesResponse = await api({
      path: `get_prfs_proof_types`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
