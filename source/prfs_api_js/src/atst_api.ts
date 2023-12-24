import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { AttestTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccResponse";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { ValidateTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccResponse";

import { api } from "./utils";
import { PrfsApiResponse } from "./types";

type RequestName = "attest_twitter_acc" | "validate_twitter_acc";

type Req<T extends RequestName> = //
  T extends "attest_twitter_acc"
    ? AttestTwitterAccRequest
    : T extends "validate_twitter_acc"
    ? ValidateTwitterAccRequest
    : never;

type Resp<T extends RequestName> = //
  T extends "attest_twitter_acc"
    ? PrfsApiResponse<AttestTwitterAccResponse>
    : T extends "validate_twitter_acc"
    ? PrfsApiResponse<ValidateTwitterAccResponse>
    : any;

let PRFS_ATST_SERVER_ENDPOINT: string;

if (typeof process !== "undefined") {
  PRFS_ATST_SERVER_ENDPOINT = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/atst_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function atstApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api(
    {
      path: name,
      req,
    },
    PRFS_ATST_SERVER_ENDPOINT,
  )) as Resp<T>;
}
