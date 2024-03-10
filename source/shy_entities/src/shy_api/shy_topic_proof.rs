use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyTopicProof;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicProofRequest {
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicProofResponse {
    pub shy_topic_proof: ShyTopicProof,
}
