import { PrfsIdApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdApiRequest";
import { PrfsIdApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdApiResponse";

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

export async function idApi<
  T extends { type: PrfsIdApiRequest["type"] },
  R extends { type: T["type"] } & PrfsIdApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
