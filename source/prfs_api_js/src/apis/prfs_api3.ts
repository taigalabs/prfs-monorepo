import prfs_api_error_codes from "@taigalabs/prfs-api-server/data_api/error_codes.json";
import { PrfsApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsApiRequest";
import { PrfsApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsApiResponse";

import { api } from "../utils";
import { ApiResponse } from "@/types";
import { GetPrfsSetsResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsSetsResponse";
import { GetPrfsCircuitByCircuitIdResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsCircuitByCircuitIdResponse";

// type Payload<T extends PrfsApiRequest["type"]> = T extends "get_prfs_sets"
//   ? PrfsApiResponse & { type: "get_prfs_sets" }
//   : T extends "get_prfs_circuit_by_circuit_id"
//   ? PrfsApiResponse & { type: "get_prfs_circuit_by_circuit_id" }
//   : never;

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("prfs api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export function prfsApi3<
  T extends { type: PrfsApiRequest["type"] },
  R extends { type: T["type"] } & PrfsApiResponse,
>(req: T): R {
  // return (await api<T>(
  //   {
  //     path: name,
  //     req,
  //   },
  //   endpoint,
  // )) as Resp<T>;
  //
  return 1 as any;
}

async function a() {
  let b = prfsApi3({ type: "get_prfs_sets", page_size: 0, page_idx: 0 });
  // b.type = "get_prfs_circuit_by_circuit_id";
}

export { prfs_api_error_codes, type PrfsApiResponse };

type KeysFrom<T, U> = { [K in keyof U]: K extends keyof T ? U[K] : never };

type D<T extends string> = Extract<PrfsApiResponse["type"], T>;

// let a: D = { type: "get_prfs_sets" };
