import { PrfsCircuit } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface GetNativeCircuitsRequest {
  page: number;
  circuit_id?: string;
}

export type GetNativeCircuitsResponse = PrfsApiResponse<{
  page: number;
  prfs_circuits: PrfsCircuit[];
}>;

export async function getPrfsNativeCircuits({ page, circuit_id }: GetNativeCircuitsRequest) {
  let req: GetNativeCircuitsRequest = {
    page,
    circuit_id,
  };

  try {
    let resp: GetNativeCircuitsResponse = await api({
      path: `get_prfs_native_circuits`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
