import { PrfsIdSessionApiRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiRequest";
import { PrfsIdSessionApiResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdSessionApiResponse";
import { PutSessionValueResponse } from "@taigalabs/prfs-entities/bindings/PutSessionValueResponse";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";
import { DeleteSessionValueResponse } from "@taigalabs/prfs-entities/bindings/DeleteSessionValueResponse";
import { PutSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutSessionValueRequest";
import { DeleteSessionValueRequest } from "@taigalabs/prfs-entities/bindings/DeleteSessionValueRequest";

// type RequestName = "sign_up_prfs_identity" | "sign_in_prfs_identity";

// type Req<T extends RequestName> = //
//   T extends "sign_up_prfs_identity"
//     ? PrfsIdentitySignUpRequest
//     : T extends "sign_in_prfs_identity"
//     ? PrfsIdentitySignInRequest
//     : never;

type S = PrfsIdSessionApiRequest["type"];

type Resp<T extends S> = //
  T extends "PUT_SESSION_VAL"
    ? PrfsApiResponse<PutSessionValueResponse>
    : T extends DeleteSessionValueRequest
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

export async function idSessionApi<T extends PrfsIdSessionApiRequest["type"]>(
  req: PrfsIdSessionApiRequest,
) {
  return (await api(
    {
      path: req.type,
      req,
    },
    endpoint,
  )) as Resp<T>;
}

const a: { type: "PUT_SESSION_VAL" } & PutSessionValueRequest = {
  type: "PUT_SESSION_VAL",
  key: "",
  value: "",
  ticket: "",
};

let b = idSessionApi(a);
