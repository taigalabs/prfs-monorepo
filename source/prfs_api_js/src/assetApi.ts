import { GetPrfsAssetMetaRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsAssetMetaRequest";
import { GetPrfsAssetMetaResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsAssetMetaResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

type RequestName = "get_prfs_asset_meta";

type Req<T extends RequestName> = //
  T extends "get_prfs_asset_meta" ? GetPrfsAssetMetaRequest : never;

type Resp<T> = //
  T extends "get_prfs_asset_meta" ? PrfsApiResponse<GetPrfsAssetMetaResponse> : any;

let PRFS_ASSET_SERVER_ENDPOINT: string;

if (typeof process !== "undefined") {
  PRFS_ASSET_SERVER_ENDPOINT = `${process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function prfsAssetApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api(
    {
      path: name,
      req,
    },
    PRFS_ASSET_SERVER_ENDPOINT
  )) as Resp<T>;
}
