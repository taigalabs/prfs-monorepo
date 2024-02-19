import { PrfsIdSessionApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiRequest";
import { PrfsIdSessionApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiResponse";
import { PutPrfsIdSessionValueResponse } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueResponse";
import { PutPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueRequest";
import { GetPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsIdSessionValueRequest";
import { GetPrfsIdSessionValueResponse } from "@taigalabs/prfs-entities/bindings/GetPrfsIdSessionValueResponse";

import { api } from "../utils";
import { ApiResponse } from "../types";

type RequestTypes = PrfsIdSessionApiRequest["type"];

type Resp<T extends RequestTypes> = //
  T extends "put_prfs_id_session_value"
    ? ApiResponse<PutPrfsIdSessionValueResponse>
    : T extends "get_prfs_id_session_value"
    ? ApiResponse<GetPrfsIdSessionValueResponse>
    : any;

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("id api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function idSessionApi<T extends R["type"], R extends PrfsIdSessionApiRequest>(req: R) {
  return (await api(
    {
      path: req.type,
      req,
    },
    endpoint,
  )) as Resp<T>;
}
