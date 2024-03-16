import { api, ApiResponse } from "@taigalabs/prfs-api-lib-js";
import { PrfsAtstApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsAtstApiRequest";
import { PrfsAtstApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsAtstApiResponse";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("atst api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/atst_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function atstApi<
  T extends { type: PrfsAtstApiRequest["type"] },
  R extends { type: T["type"] } & PrfsAtstApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
