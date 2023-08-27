import { GetPrfsProofInstancesByShortIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesByShortIdResponse";
import { GetPrfsProofInstanceByShortIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByShortIdRequest";
import { GetPrfsProofInstancesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesResponse";
import { GetPrfsProofInstancesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstancesRequest";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import { GetPrfsProofInstanceByInstanceIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdResponse";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";
import { CreatePrfsProofInstanceResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export type CreatePrfsProofInstanceApiResponse = PrfsApiResponse<CreatePrfsProofInstanceResponse>;

export async function createPrfsProofInstance(req: CreatePrfsProofInstanceRequest) {
  return (await api({
    path: `create_prfs_proof_instance`,
    req,
  })) as PrfsApiResponse<CreatePrfsProofInstanceResponse>;
}

export type GetPrfsProofInstancesApiResponse = PrfsApiResponse<GetPrfsProofInstancesResponse>;

export async function getPrfsProofInstances(req: GetPrfsProofInstancesRequest) {
  return (await api({
    path: `get_prfs_proof_instances`,
    req,
  })) as PrfsApiResponse<GetPrfsProofInstancesResponse>;
}

export async function getPrfsProofInstanceByInstanceId(
  req: GetPrfsProofInstanceByInstanceIdRequest
) {
  return (await api({
    path: `get_prfs_proof_instance_by_instance_id`,
    req,
  })) as PrfsApiResponse<GetPrfsProofInstanceByInstanceIdResponse>;
}

export async function getPrfsProofInstanceByShortId(req: GetPrfsProofInstanceByShortIdRequest) {
  return (await api({
    path: `get_prfs_proof_instance_by_short_id`,
    req,
  })) as PrfsApiResponse<GetPrfsProofInstancesByShortIdResponse>;
}
