// import { PrfsCircuit } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";
import { PublicInput } from "@taigalabs/prfs-entities/bindings/PublicInput";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";

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

// export interface PrfsCircuit {
//   circuit_id: string;
//   label: string;
//   author: string;
//   public_inputs: PublicInput[];
//   desc: string;
//   created_at: string;
//   proof_algorithm: string;
//   arithmetization: string;
//   circuit_dsl: string;
//   elliptic_curve: string;
//   finite_field: string;
//   driver: PrfsCircuitDriver;
// }

// export interface PrfsCircuitDriver {
//   driver_id: string;
//   driver_repository_url: string;
//   version: string;
//   properties: Record<string, any>;
// }
