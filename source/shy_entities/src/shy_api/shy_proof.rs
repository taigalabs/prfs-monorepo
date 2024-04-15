use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyProof;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyProofsRequest {
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyProofsResponse {
    pub shy_proofs: Vec<ShyProof>,
}
