use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::syn::PrfsCircuitSyn1;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitsRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitsResponse {
    pub page_idx: i32,
    pub prfs_circuits_syn1: Vec<PrfsCircuitSyn1>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitByCircuitIdRequest {
    pub circuit_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsCircuitByCircuitIdResponse {
    pub prfs_circuit_syn1: PrfsCircuitSyn1,
}
