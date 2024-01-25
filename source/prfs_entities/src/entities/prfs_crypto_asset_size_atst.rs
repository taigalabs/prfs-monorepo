use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::PrfsAtstStatus;
use crate::atst_api_entities::CryptoAsset;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsCryptoAssetSizeAtst {
    pub atst_id: String,
    pub atst_type: String,
    pub wallet_addr: String,
    pub cm: String,
    #[ts(type = "Record<string, any>[]")]
    pub crypto_assets: sqlx::types::Json<Vec<CryptoAsset>>,
    #[ts(type = "string")]
    pub total_value_usd: Decimal,
    pub status: PrfsAtstStatus,
}
