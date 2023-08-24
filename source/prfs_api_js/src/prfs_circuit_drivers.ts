import { PrfsApiResponse } from "./types";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";

import { api } from "./utils";

export interface GetNativeCircuitDriversRequest {
  page: number;
  circuit_driver_id?: string;
}

export type GetNativeCircuitDriversResponse = PrfsApiResponse<{
  page: number;
  prfs_circuit_drivers: PrfsCircuitDriver[];
}>;

export async function getPrfsNativeCircuitDrivers({
  page,
  circuit_driver_id,
}: GetNativeCircuitDriversRequest) {
  let req: GetNativeCircuitDriversRequest = {
    page,
    circuit_driver_id,
  };

  try {
    let resp: GetNativeCircuitDriversResponse = await api({
      path: `get_prfs_native_circuit_drivers`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
    throw err;
  }
}
