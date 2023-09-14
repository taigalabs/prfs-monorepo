use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    entities::{PrfsProofInstance, PrfsSet},
    syn_entities::PrfsProofInstanceSyn1,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsPoll {}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsPollResponse {
    pub page_idx: i32,
    pub table_row_count: f32,
    pub prfs_proof_instances_syn1: Vec<PrfsProofInstanceSyn1>,
}
