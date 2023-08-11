import { PrfsApiResponse } from "./types";
import { CircuitType } from "@taigalabs/prfs-entities/bindings/CircuitType";

import { api } from "./utils";

export interface GetNativeCircuitTypesRequest {
  page: number;
  circuit_type_id?: string;
}

export type GetNativeCircuitTypesResponse = PrfsApiResponse<{
  page: number;
  prfs_circuit_types: CircuitType[];
}>;

export async function getPrfsNativeCircuitTypes({
  page,
  circuit_type_id,
}: GetNativeCircuitTypesRequest) {
  let req: GetNativeCircuitTypesRequest = {
    page,
    circuit_type_id,
  };

  try {
    let resp: GetNativeCircuitTypesResponse = await api({
      path: `get_prfs_native_circuit_types`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
