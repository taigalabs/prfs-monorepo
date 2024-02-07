import { PrfsIdSessionApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiRequest";
import { PrfsIdSessionApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiResponse";
import { PutSessionValueResponse } from "@taigalabs/prfs-entities/bindings/PutSessionValueResponse";
import { DeleteSessionValueResponse } from "@taigalabs/prfs-entities/bindings/DeleteSessionValueResponse";
import { PutSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutSessionValueRequest";
import { DeleteSessionValueRequest } from "@taigalabs/prfs-entities/bindings/DeleteSessionValueRequest";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";

type RqeustTypes = PrfsIdSessionApiRequest["type"];

type Resp<T extends RqeustTypes> = //
  T extends "PUT_SESSION_VAL"
    ? PrfsApiResponse<PutSessionValueResponse>
    : T extends "DELETE_SESSION_VAL"
    ? PrfsApiResponse<DeleteSessionValueResponse>
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
