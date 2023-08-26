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
pub struct GetPrfsProofInstancesRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofInstancesByInstanceIdRequest {
    #[ts(type = "string")]
    pub proof_instance_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofInstancesByInstanceIdResponse {
    pub prfs_proof_instance_syn1: PrfsProofInstanceSyn1,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofInstancesByShortIdResponse {
    pub prfs_proof_instance: PrfsProofInstance,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofInstancesResponse {
    pub page_idx: i32,
    pub prfs_proof_instances_syn1: Vec<PrfsProofInstanceSyn1>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofInstanceByShortIdRequest {
    pub short_id: String,
}
