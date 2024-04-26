use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    AttestTwitterAccRequest, AttestTwitterAccResponse, ComputeCryptoAssetTotalValuesRequest,
    ComputeCryptoAssetTotalValuesResponse, FetchCryptoAssetRequest, FetchCryptoAssetResponse,
    GetTwitterAccAtstRequest, GetTwitterAccAtstResponse, GetTwitterAccAtstsRequest,
    GetTwitterAccAtstsResponse, ValidateTwitterAccRequest, ValidateTwitterAccResponse,
};
use crate::{
    CreateGroupMemberAtstRequest, CreatePrfsAttestationRequest, CreatePrfsAttestationResponse,
    GetPrfsAtstGroupByGroupIdRequest, GetPrfsAtstGroupByGroupIdResponse, GetPrfsAtstGroupsRequest,
    GetPrfsAtstGroupsResponse, GetPrfsAttestationRequest, GetPrfsAttestationResponse,
    GetPrfsAttestationsByAtstGroupIdRequest, GetPrfsAttestationsResponse,
    ValidateGroupMembershipRequest, ValidateGroupMembershipResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsAtstApiRequest {
    fetch_crypto_asset(FetchCryptoAssetRequest),
    compute_crypto_asset_total_values(ComputeCryptoAssetTotalValuesRequest),
    create_crypto_asset_atst(CreatePrfsAttestationRequest),
    create_prfs_attestation(CreatePrfsAttestationRequest),
    get_prfs_attestations_by_atst_group_id(GetPrfsAttestationsByAtstGroupIdRequest),
    get_prfs_attestation(GetPrfsAttestationRequest),
    get_prfs_atst_groups(GetPrfsAtstGroupsRequest),
    get_prfs_atst_group_by_group_id(GetPrfsAtstGroupByGroupIdRequest),
    create_group_member_atst(CreateGroupMemberAtstRequest),
    validate_group_membership(ValidateGroupMembershipRequest),
    validate_twitter_acc(ValidateTwitterAccRequest),
    attest_twitter_acc(AttestTwitterAccRequest),
    get_twitter_acc_atsts(GetTwitterAccAtstsRequest),
    get_twitter_acc_atst(GetTwitterAccAtstRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsAtstApiResponse {
    fetch_crypto_asset(FetchCryptoAssetResponse),
    compute_crypto_asset_total_values(ComputeCryptoAssetTotalValuesResponse),
    create_crypto_asset_atst(CreatePrfsAttestationResponse),
    create_prfs_attestation(CreatePrfsAttestationResponse),
    get_prfs_attestations_by_atst_group_id(GetPrfsAttestationsResponse),
    get_prfs_attestation(GetPrfsAttestationResponse),
    get_prfs_atst_groups(GetPrfsAtstGroupsResponse),
    get_prfs_atst_group_by_group_id(GetPrfsAtstGroupByGroupIdResponse),
    create_group_member_atst(CreatePrfsAttestationResponse),
    validate_group_membership(ValidateGroupMembershipResponse),
    validate_twitter_acc(ValidateTwitterAccResponse),
    attest_twitter_acc(AttestTwitterAccResponse),
    get_twitter_acc_atsts(GetTwitterAccAtstsResponse),
    get_twitter_acc_atst(GetTwitterAccAtstResponse),
}
