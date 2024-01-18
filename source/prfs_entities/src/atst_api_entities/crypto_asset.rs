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
    pub crypto_asset: CryptoAsset,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CryptoAsset {
    pub wallet_addr: String,
    #[ts(type = "bigint")]
    pub amount: Decimal,
    pub unit: String,
}
