import { PrfsApiResponse } from "./types";
import { GetPrfsCircuitTypesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypesRequest";
import { GetPrfsCircuitTypesResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypesResponse";
import { GetPrfsCircuitTypeByCircuitTypeRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypeByCircuitTypeRequest";
import { GetPrfsCircuitTypeByCircuitTypeResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitTypeByCircuitTypeResponse";

import { api } from "./utils";

export async function getPrfsCircuitTypes(req: GetPrfsCircuitTypesRequest) {
  return (await api({
    path: `get_prfs_circuit_types`,
    req,
  })) as PrfsApiResponse<GetPrfsCircuitTypesResponse>;
}

export async function getPrfsCircuitTypeByCircuitType(req: GetPrfsCircuitTypeByCircuitTypeRequest) {
  return (await api({
    path: `get_prfs_circuit_type_by_circuit_type`,
    req,
  })) as PrfsApiResponse<GetPrfsCircuitTypeByCircuitTypeResponse>;
}
