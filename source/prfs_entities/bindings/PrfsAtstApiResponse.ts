// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AttestTwitterAccResponse } from "./AttestTwitterAccResponse";
import type { ComputeCryptoAssetTotalValuesResponse } from "./ComputeCryptoAssetTotalValuesResponse";
import type { CreatePrfsAttestationResponse } from "./CreatePrfsAttestationResponse";
import type { FetchCryptoAssetResponse } from "./FetchCryptoAssetResponse";
import type { GetPrfsAtstGroupsResponse } from "./GetPrfsAtstGroupsResponse";
import type { GetPrfsAttestationResponse } from "./GetPrfsAttestationResponse";
import type { GetPrfsAttestationsResponse } from "./GetPrfsAttestationsResponse";
import type { GetTwitterAccAtstResponse } from "./GetTwitterAccAtstResponse";
import type { GetTwitterAccAtstsResponse } from "./GetTwitterAccAtstsResponse";
import type { ValidateGroupMembershipResponse } from "./ValidateGroupMembershipResponse";
import type { ValidateTwitterAccResponse } from "./ValidateTwitterAccResponse";

export type PrfsAtstApiResponse =
  | ({ type: "fetch_crypto_asset" } & FetchCryptoAssetResponse)
  | ({ type: "compute_crypto_asset_total_values" } & ComputeCryptoAssetTotalValuesResponse)
  | ({ type: "create_crypto_asset_atst" } & CreatePrfsAttestationResponse)
  | ({ type: "create_prfs_attestation" } & CreatePrfsAttestationResponse)
  | ({ type: "get_prfs_attestations" } & GetPrfsAttestationsResponse)
  | ({ type: "get_prfs_attestation" } & GetPrfsAttestationResponse)
  | ({ type: "get_prfs_atst_groups" } & GetPrfsAtstGroupsResponse)
  | ({ type: "validate_group_membership" } & ValidateGroupMembershipResponse)
  | ({ type: "validate_twitter_acc" } & ValidateTwitterAccResponse)
  | ({ type: "attest_twitter_acc" } & AttestTwitterAccResponse)
  | ({ type: "get_twitter_acc_atsts" } & GetTwitterAccAtstsResponse)
  | ({ type: "get_twitter_acc_atst" } & GetTwitterAccAtstResponse);
