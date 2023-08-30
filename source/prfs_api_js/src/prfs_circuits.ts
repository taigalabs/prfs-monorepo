import { PrfsApiResponse } from "./types";
import { GetPrfsCircuitsRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitsRequest";
import { GetPrfsCircuitsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitsResponse";
import { GetPrfsCircuitByCircuitIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitByCircuitIdRequest";
import { GetPrfsCircuitByCircuitIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitByCircuitIdResponse";

import { api } from "./utils";

// export async function getPrfsCircuits(req: GetPrfsCircuitsRequest) {
//   return (await api({
//     path: `get_prfs_circuits`,
//     req,
//   })) as PrfsApiResponse<GetPrfsCircuitsResponse>;
// }

// export async function getPrfsCircuitByCircuitId(req: GetPrfsCircuitByCircuitIdRequest) {
//   return (await api({
//     path: `get_prfs_circuit_by_circuit_id`,
//     req,
//   })) as PrfsApiResponse<GetPrfsCircuitByCircuitIdResponse>;
// }
