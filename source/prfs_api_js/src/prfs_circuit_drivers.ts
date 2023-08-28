import { PrfsApiResponse } from "./types";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";
import { GetPrfsCircuitDriversRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriversRequest";
import { GetPrfsCircuitDriversResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriversResponse";
import { GetPrfsCircuitDriverByDriverIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriverByDriverIdRequest";
import { GetPrfsCircuitDriverByDriverIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitDriverByDriverIdResponse";

import { api } from "./utils";

export async function getPrfsCircuitDrivers(req: GetPrfsCircuitDriversRequest) {
  return (await api({
    path: `get_prfs_circuit_drivers`,
    req,
  })) as PrfsApiResponse<GetPrfsCircuitDriversResponse>;
}

export async function getPrfsCircuitDriverByDriverId(req: GetPrfsCircuitDriverByDriverIdRequest) {
  return (await api({
    path: `get_prfs_circuit_driver_by_driver_id`,
    req,
  })) as PrfsApiResponse<GetPrfsCircuitDriverByDriverIdResponse>;
}
