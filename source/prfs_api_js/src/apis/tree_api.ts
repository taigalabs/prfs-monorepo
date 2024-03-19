import { api, ApiResponse } from "@taigalabs/prfs-api-lib-js";
import { PrfsTreeApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsTreeApiRequest";
import { PrfsTreeApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsTreeApiResponse";

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("tree api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/tree_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function treeApi<
  T extends { type: PrfsTreeApiRequest["type"] },
  R extends { type: T["type"] } & PrfsTreeApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  return api<R>(
    {
      path: req.type,
      req,
    },
    endpoint,
  );
}
