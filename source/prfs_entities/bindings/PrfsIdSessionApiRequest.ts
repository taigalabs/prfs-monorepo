// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ClosePrfsIdSessionRequest } from "./ClosePrfsIdSessionRequest";
import type { GetPrfsIdSessionValueRequest } from "./GetPrfsIdSessionValueRequest";
import type { OpenPrfsIdSession2Request } from "./OpenPrfsIdSession2Request";
import type { PutPrfsIdSessionValueRequest } from "./PutPrfsIdSessionValueRequest";

export type PrfsIdSessionApiRequest =
  | ({ type: "open_prfs_id_session2" } & OpenPrfsIdSession2Request)
  | ({ type: "close_prfs_id_session" } & ClosePrfsIdSessionRequest)
  | ({ type: "put_prfs_id_session_value" } & PutPrfsIdSessionValueRequest)
  | ({ type: "get_prfs_id_session_value" } & GetPrfsIdSessionValueRequest);
