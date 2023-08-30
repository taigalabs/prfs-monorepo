import { GetPrfsProofTypesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypesRequest";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { GetPrfsProofTypeByProofTypeIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdResponse";
import { GetPrfsProofTypesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypesResponse";
import { CreatePrfsProofTypeRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofTypeRequest";
import { CreatePrfsProofTypeResponse } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofTypeResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export async function createPrfsProofType(req: CreatePrfsProofTypeRequest) {
  return (await api({
    path: `create_prfs_proof_type`,
    req,
  })) as PrfsApiResponse<CreatePrfsProofTypeResponse>;
}

export async function getPrfsProofTypes(req: GetPrfsProofTypesRequest) {
  return (await api({
    path: `get_prfs_proof_types`,
    req,
  })) as PrfsApiResponse<GetPrfsProofTypesResponse>;
}

export async function getPrfsProofTypeByProofTypeId(req: GetPrfsProofTypeByProofTypeIdRequest) {
  return (await api({
    path: `get_prfs_proof_type_by_proof_type_id`,
    req,
  })) as PrfsApiResponse<GetPrfsProofTypeByProofTypeIdResponse>;
}
