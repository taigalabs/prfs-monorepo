use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsCryptoSizeAtst;

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
pub struct GetCryptoSizeAtstsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoSizeAtstsResponse {
    pub rows: Vec<PrfsCryptoSizeAtst>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCryptoSizeAtstRequest {
    pub atst_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ComputeCryptoSizeTotalValuesRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
#[allow(non_snake_case)]
pub struct ComputeCryptoSizeTotalValuesResponse {
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
pub struct GetCryptoSizeAtstResponse {
    pub prfs_crypto_size_atst: PrfsCryptoSizeAtst,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateCryptoSizeAtstRequest {
    pub atst_id: String,
    pub atst_type: String,
    pub wallet_addr: String,
    pub cm: String,
    pub crypto_assets: Vec<CryptoAsset>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateCryptoSizeAtstResponse {
    pub is_valid: bool,
    pub atst_id: String,
}
