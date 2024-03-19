use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{atst_entities::PrfsAttestation, PrfsAtstType};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct FetchCryptoAssetRequest {
    pub wallet_addr: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct FetchCryptoAssetResponse {
    pub wallet_addr: String,
    pub crypto_assets: Vec<CryptoAsset>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct FetchCryptoAssetResult {
    pub wallet_addr: String,
    pub crypto_assets: Vec<CryptoAsset>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct CryptoAsset {
    #[ts(type = "bigint")]
    pub amount: Decimal,
    pub unit: String,
    pub symbol: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoAssetSizeAtstsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoAssetSizeAtstsResponse {
    pub rows: Vec<PrfsAttestation>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoAssetSizeAtstRequest {
    pub atst_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoAssetSizeAtstResponse {
    pub prfs_attestation: PrfsAttestation,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ComputeCryptoAssetSizeTotalValuesRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
#[allow(non_snake_case)]
pub struct ComputeCryptoAssetSizeTotalValuesResponse {
    pub exchange_rates: CoinbaseExchangeRates,
    pub updated_row_count: u128,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
#[allow(non_snake_case)]
pub struct CryptoCurrencyRates {
    pub USD: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CoinbaseExchangeRates {
    pub currency: String,
    pub rates: CryptoCurrencyRates,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateCryptoAssetSizeAtstRequest {
    pub atst_id: String,
    pub atst_type: PrfsAtstType,
    pub label: String,
    pub serial_no: String,
    pub cm: String,
    pub cm_msg: Vec<u8>,
    pub sig: String,
    // pub meta: Vec<CryptoAsset>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateCryptoAssetSizeAtstResponse {
    pub is_valid: bool,
    pub atst_id: String,
}
