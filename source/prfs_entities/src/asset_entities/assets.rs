use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
pub struct GetAssetMetaRequest {
    pub driver_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
pub struct GetAssetMetaResponse {
    pub driver_id: String,
    pub asset_urls: Vec<String>,
}
