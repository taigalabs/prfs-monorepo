use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyProof;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyProofRequest {
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyProofResponse {
    pub shy_proof: ShyProof,
}
