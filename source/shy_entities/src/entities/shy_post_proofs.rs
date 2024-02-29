use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPostProof {
    pub shy_post_proof_id: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub public_key: String,
}
