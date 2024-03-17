use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::prfs_attestation::PrfsAtstStatus;
use crate::{atst_api::CryptoAsset, PrfsAtstType};

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsCryptoAssetSizeAtst {
    pub atst_id: String,
    pub atst_type: PrfsAtstType,
    pub label: String,
    pub cm: String,
    #[ts(type = "Record<string, any>[]")]
    pub meta: sqlx::types::Json<Vec<CryptoAsset>>,
    pub status: PrfsAtstStatus,
    #[ts(type = "string")]
    pub value: Decimal,
}
