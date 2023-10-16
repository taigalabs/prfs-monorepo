use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsCircuitType;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitTypesRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitTypesResponse {
    pub page_idx: i32,
    pub prfs_circuit_types: Vec<PrfsCircuitType>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitTypeByCircuitTypeIdRequest {
    pub circuit_type_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitTypeByCircuitTypeIdResponse {
    pub prfs_circuit_type: PrfsCircuitType,
}
