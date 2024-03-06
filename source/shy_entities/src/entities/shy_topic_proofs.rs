use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyTopicProof {
    pub shy_topic_proof_id: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub public_key: String,
    pub serial_no: String,
    pub proof_identity_input: String,
}
