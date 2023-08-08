// import { PrfsCircuitDriver } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { PrfsCircuitDriver } from "./prfs_circuits";

export interface GetNativeCircuitDriversRequest {
  page: number;
  driver_id?: string;
}

export type GetNativeCircuitDriversResponse = PrfsApiResponse<{
  page: number;
  prfs_circuit_drivers: PrfsCircuitDriver[];
}>;

export async function getPrfsNativeCircuitDrivers({
  page,
  driver_id,
}: GetNativeCircuitDriversRequest) {
  let req: GetNativeCircuitDriversRequest = {
    page,
    driver_id,
  };

  try {
    let resp: GetNativeCircuitDriversResponse = await api({
      path: `get_prfs_native_circuit_drivers`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
