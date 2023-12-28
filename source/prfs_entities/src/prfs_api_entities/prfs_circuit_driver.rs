use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsCircuitDriver;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitDriversRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitDriversResponse {
    pub page_idx: i32,
    pub prfs_circuit_drivers: Vec<PrfsCircuitDriver>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitDriverByDriverIdRequest {
    pub circuit_driver_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitDriverByDriverIdResponse {
    pub prfs_circuit_driver: PrfsCircuitDriver,
}
