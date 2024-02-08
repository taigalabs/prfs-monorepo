import { PrfsIdSessionApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiRequest";
import { PrfsIdSessionApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiResponse";
import { PutPrfsIdSessionValueResponse } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueResponse";
import { DeletePrfsIdSessionValueResponse } from "@taigalabs/prfs-entities/bindings/DeletePrfsIdSessionValueResponse";
import { PutPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueRequest";
import { DeletePrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/DeletePrfsIdSessionValueRequest";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";

type RequestTypes = PrfsIdSessionApiRequest["type"];

type Resp<T extends RequestTypes> = //
  T extends "put_session_val"
    ? PrfsApiResponse<PutPrfsIdSessionValueResponse>
    : T extends "delete_session_val"
    ? PrfsApiResponse<DeletePrfsIdSessionValueResponse>
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
