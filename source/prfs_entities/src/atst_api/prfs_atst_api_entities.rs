use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    AttestTwitterAccRequest, AttestTwitterAccResponse, ComputeCryptoAssetSizeTotalValuesRequest,
    ComputeCryptoAssetSizeTotalValuesResponse, CreateCryptoAssetSizeAtstRequest,
    CreateCryptoAssetSizeAtstResponse, FetchCryptoAssetRequest, FetchCryptoAssetResponse,
    GetTwitterAccAtstRequest, GetTwitterAccAtstResponse, GetTwitterAccAtstsRequest,
    GetTwitterAccAtstsResponse, ValidateTwitterAccRequest, ValidateTwitterAccResponse,
};
use crate::{
    CreatePrfsAttestationRequest, CreatePrfsAttestationResponse, GetPrfsAttestationRequest,
    GetPrfsAttestationResponse, GetPrfsAttestationsRequest, GetPrfsAttestationsResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsAtstApiRequest {
    fetch_crypto_asset(FetchCryptoAssetRequest),
    create_crypto_asset_size_atst(CreateCryptoAssetSizeAtstRequest),
    create_prfs_attestation(CreatePrfsAttestationRequest),
    get_prfs_attestations(GetPrfsAttestationsRequest),
    get_prfs_attestation(GetPrfsAttestationRequest),
    compute_crypto_asset_size_total_values(ComputeCryptoAssetSizeTotalValuesRequest),
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
    create_crypto_asset_size_atst(CreateCryptoAssetSizeAtstResponse),
    create_prfs_attestation(CreatePrfsAttestationResponse),
    get_prfs_attestations(GetPrfsAttestationsResponse),
    get_prfs_attestation(GetPrfsAttestationResponse),
    compute_crypto_asset_size_total_values(ComputeCryptoAssetSizeTotalValuesResponse),
    validate_twitter_acc(ValidateTwitterAccResponse),
    attest_twitter_acc(AttestTwitterAccResponse),
    get_twitter_acc_atsts(GetTwitterAccAtstsResponse),
    get_twitter_acc_atst(GetTwitterAccAtstResponse),
}
