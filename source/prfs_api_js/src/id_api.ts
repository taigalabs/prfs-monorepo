import { PrfsIdentitySignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpRequest";
import { PrfsIdentitySignUpResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpResponse";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { PrfsIdentitySignInResponse } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

type RequestName = "sign_up_prfs_account" | "sign_in_prfs_account";

type Req<T extends RequestName> = //
  T extends "sign_up_prfs_identity"
    ? PrfsIdentitySignUpRequest
    : T extends "sign_in_prfs_identity"
    ? PrfsIdentitySignInRequest
    : never;

type Resp<T> = //
  T extends "sign_up_prfs_identity"
    ? PrfsApiResponse<PrfsIdentitySignUpResponse>
    : T extends "sign_in_prfs_identity"
    ? PrfsApiResponse<PrfsIdentitySignInResponse>
    : any;

let PRFS_ID_SERVER_ENDPOINT: string;

if (typeof process !== "undefined") {
  PRFS_ID_SERVER_ENDPOINT = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/id_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function idApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api(
    {
      path: name,
      req,
    },
    PRFS_ID_SERVER_ENDPOINT,
  )) as Resp<T>;
}
