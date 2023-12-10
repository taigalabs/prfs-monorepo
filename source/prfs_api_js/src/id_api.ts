import { PrfsSignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignUpRequest";
import { PrfsSignUpResponse } from "@taigalabs/prfs-entities/bindings/PrfsSignUpResponse";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";
import { PrfsSignInResponse } from "@taigalabs/prfs-entities/bindings/PrfsSignInResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

type RequestName = "sign_up_prfs_account" | "sign_in_prfs_account";

type Req<T extends RequestName> = //
  T extends "sign_up_prfs_account"
    ? PrfsSignUpRequest
    : T extends "sign_in_prfs_account"
    ? PrfsSignInRequest
    : never;

type Resp<T> = //
  T extends "sign_up_prfs_account"
    ? PrfsApiResponse<PrfsSignUpResponse>
    : T extends "sign_in_prfs_account"
    ? PrfsApiResponse<PrfsSignInResponse>
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
