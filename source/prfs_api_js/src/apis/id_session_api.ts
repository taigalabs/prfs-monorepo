import { api, ApiResponse } from "@taigalabs/prfs-api-lib-js";
import { PrfsIdSessionApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiRequest";
import { PrfsIdSessionApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiResponse";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("id api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function idSessionApi<
  T extends { type: PrfsIdSessionApiRequest["type"] },
  R extends { type: T["type"] } & PrfsIdSessionApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
