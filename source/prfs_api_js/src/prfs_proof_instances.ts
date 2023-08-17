import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface CreatePrfsProofInstanceRequest {
  sig: string;
  proof_type_id: string;
  proof: number[];
  public_inputs: Record<string, any>;
}

export type CreatePrfsProofInstanceResponse = PrfsApiResponse<{}>;

export async function createPrfsProofInstance(req: CreatePrfsProofInstanceRequest) {
  try {
    let resp: CreatePrfsProofInstanceResponse = await api({
      path: `create_prfs_proof_instance`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}

export interface GetPrfsProofInstancesRequest {
  page: number;
  limit?: number;
  proof_instance_id?: string;
}

export type GetPrfsProofInstancesResponse = PrfsApiResponse<{
  page: number;
  prfs_proof_instances: PrfsProofInstance[];
}>;

export async function getPrfsProofInstances(req: GetPrfsProofInstancesRequest) {
  try {
    let resp: GetPrfsProofInstancesResponse = await api({
      path: `get_prfs_proof_instances`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
