// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CryptoAsset } from "./CryptoAsset";
import type { GroupMemberAtstMeta } from "./GroupMemberAtstMeta";

export type PrfsAtstMeta =
  | ({ type: "crypto_asset" } & Array<CryptoAsset>)
  | ({ type: "group_member" } & GroupMemberAtstMeta);
