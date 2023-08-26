use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::syn_entities::PrfsCircuitSyn1;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitsRequest {
    pub page: u32,

    #[ts(type = "'<Uuid>' | string | null")]
    pub circuit_id: Option<Uuid>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetCircuitsResponse {
    pub page: usize,
    pub prfs_circuits_syn1: Vec<PrfsCircuitSyn1>,
}
