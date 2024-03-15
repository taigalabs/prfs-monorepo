import { api, ApiResponse } from "@taigalabs/prfs-api-lib-js";
import { ShyApiRequest } from "@taigalabs/shy-entities/bindings/ShyApiRequest";
import { ShyApiResponse } from "@taigalabs/shy-entities/bindings/ShyApiResponse";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("prfs api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/shy_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function shyApi2<
  T extends { type: ShyApiRequest["type"] },
  R extends { type: T["type"] } & ShyApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
