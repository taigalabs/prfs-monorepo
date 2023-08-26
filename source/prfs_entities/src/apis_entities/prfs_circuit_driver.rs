use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsCircuitDriver;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitDriversRequest {
    pub page: u32,
    pub circuit_driver_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitDriversResponse {
    pub page: usize,
    pub prfs_circuit_drivers: Vec<PrfsCircuitDriver>,
}
