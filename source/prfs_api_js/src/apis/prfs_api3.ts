import prfs_api_error_codes from "@taigalabs/prfs-api-server/data_api/error_codes.json";
import { PrfsApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsApiRequest";
import { PrfsApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsApiResponse";

import { api } from "../utils";
import { ApiResponse } from "../types";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("prfs api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function prfsApi3<
  T extends { type: PrfsApiRequest["type"] },
  R extends { type: T["type"] } & PrfsApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}

export { prfs_api_error_codes };
