use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct GetAssetMetaRequest {}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetAssetMetaResponse {}
