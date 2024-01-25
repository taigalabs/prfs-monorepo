import { AttestTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccRequest";
import { AttestTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/AttestTwitterAccResponse";
import { ValidateTwitterAccRequest } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccRequest";
import { ValidateTwitterAccResponse } from "@taigalabs/prfs-entities/bindings/ValidateTwitterAccResponse";
import { GetTwitterAccAtstsRequest } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsRequest";
import { GetTwitterAccAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstsResponse";
import { GetTwitterAccAtstRequest } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstRequest";
import { GetTwitterAccAtstResponse } from "@taigalabs/prfs-entities/bindings/GetTwitterAccAtstResponse";
import { FetchCryptoAssetRequest } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetRequest";
import { FetchCryptoAssetResponse } from "@taigalabs/prfs-entities/bindings/FetchCryptoAssetResponse";
import { CreateCryptoSizeAtstRequest } from "@taigalabs/prfs-entities/bindings/CreateCryptoSizeAtstRequest";
import { CreateCryptoSizeAtstResponse } from "@taigalabs/prfs-entities/bindings/CreateCryptoSizeAtstResponse";
import { GetCryptoSizeAtstsRequest } from "@taigalabs/prfs-entities/bindings/GetCryptoSizeAtstsRequest";
import { GetCryptoSizeAtstsResponse } from "@taigalabs/prfs-entities/bindings/GetCryptoSizeAtstsResponse";
import { GetCryptoSizeAtstRequest } from "@taigalabs/prfs-entities/bindings/GetCryptoSizeAtstRequest";
import { GetCryptoSizeAtstResponse } from "@taigalabs/prfs-entities/bindings/GetCryptoSizeAtstResponse";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";
import { ComputeCryptoSizeTotalValuesResponse } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesResponse";

import { api } from "../utils";
import { PrfsApiResponse } from "../types";

type RequestName =
  | "attest_twitter_acc"
  | "validate_twitter_acc"
  | "get_twitter_acc_atsts"
  | "get_twitter_acc_atst"
  | "fetch_crypto_asset"
  | "create_crypto_size_atst"
  | "get_crypto_size_atsts"
  | "get_crypto_size_atst"
  | "compute_crypto_size_total_values";

type Req<T extends RequestName> = //
  T extends "attest_twitter_acc"
    ? AttestTwitterAccRequest
    : T extends "validate_twitter_acc"
    ? ValidateTwitterAccRequest
    : T extends "get_twitter_acc_atsts"
    ? GetTwitterAccAtstsRequest
    : T extends "get_twitter_acc_atst"
    ? GetTwitterAccAtstRequest
    : T extends "fetch_crypto_asset"
    ? FetchCryptoAssetRequest
    : T extends "create_crypto_size_atst"
    ? CreateCryptoSizeAtstRequest
    : T extends "get_crypto_size_atsts"
    ? GetCryptoSizeAtstsRequest
    : T extends "get_crypto_size_atst"
    ? GetCryptoSizeAtstRequest
    : T extends "compute_crypto_size_total_values"
    ? ComputeCryptoSizeTotalValuesRequest
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
    : T extends "fetch_crypto_asset"
    ? PrfsApiResponse<FetchCryptoAssetResponse>
    : T extends "create_crypto_size_atst"
    ? PrfsApiResponse<CreateCryptoSizeAtstResponse>
    : T extends "get_crypto_size_atsts"
    ? PrfsApiResponse<GetCryptoSizeAtstsResponse>
    : T extends "get_crypto_size_atst"
    ? PrfsApiResponse<GetCryptoSizeAtstResponse>
    : T extends "compute_crypto_size_total_values"
    ? PrfsApiResponse<ComputeCryptoSizeTotalValuesResponse>
    : any;

let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("atst api endpoint not defined");
  }
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
