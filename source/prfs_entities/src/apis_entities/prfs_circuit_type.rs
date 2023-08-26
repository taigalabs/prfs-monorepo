use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsCircuitType;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitTypesRequest {
    pub page: u32,
    pub circuit_type: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitTypesResponse {
    pub page: usize,
    pub prfs_circuit_types: Vec<PrfsCircuitType>,
}
