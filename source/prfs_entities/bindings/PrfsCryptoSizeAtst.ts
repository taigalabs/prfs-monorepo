// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PrfsAtstStatus } from "./PrfsAtstStatus";

export interface PrfsCryptoSizeAtst {
  atst_id: string;
  atst_type: string;
  wallet_addr: string;
  cm: string;
  crypto_assets: Record<string, any>[];
  status: PrfsAtstStatus;
}