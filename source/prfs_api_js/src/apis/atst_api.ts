import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { AttestTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccResponse";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { ValidateTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccResponse";
import { GetTwitterAccAtstsRequest } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsRequest";
import { GetTwitterAccAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsResponse";
import { GetTwitterAccAtstRequest } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstRequest";
import { GetTwitterAccAtstResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstResponse";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";

type RequestName =
  | "attest_twitter_acc"
  | "validate_twitter_acc"
  | "get_twitter_acc_atsts"
  | "get_twitter_acc_atst";

type Req<T extends RequestName> = //
  T extends "attest_twitter_acc"
    ? AttestTwitterAccRequest
    : T extends "validate_twitter_acc"
    ? ValidateTwitterAccRequest
    : T extends "get_twitter_acc_atsts"
    ? GetTwitterAccAtstsRequest
    : T extends "get_twitter_acc_atst"
    ? GetTwitterAccAtstRequest
    : never;

type Resp<T extends RequestName> = //
  T extends "attest_twitter_acc"
    ? PrfsApiResponse<AttestTwitterAccResponse>
    : T extends "validate_twitter_acc"
    ? PrfsApiResponse<ValidateTwitterAccResponse>
    : T extends "get_twitter_acc_atsts"
    ? PrfsApiResponse<GetTwitterAccAtstsResponse>
    : T extends "get_twitter_acc_atst"
    ? PrfsApiResponse<GetTwitterAccAtstResponse>
    : any;

let endpoint: string;
if (typeof process !== "undefined") {
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/atst_api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function atstApi<T extends RequestName>(name: T, req: Req<T>): Promise<Resp<T>> {
  return (await api(
    {
      path: name,
      req,
    },
    endpoint,
  )) as Resp<T>;
}
