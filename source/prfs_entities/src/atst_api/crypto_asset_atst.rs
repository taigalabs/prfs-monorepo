use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

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
pub struct ComputeCryptoAssetTotalValuesRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
#[allow(non_snake_case)]
pub struct ComputeCryptoAssetTotalValuesResponse {
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
