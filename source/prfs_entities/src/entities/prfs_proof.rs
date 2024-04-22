use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsProof {
    pub prfs_proof_id: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub public_key: String,
    pub serial_no: String,
    pub proof_identity_input: String,
    pub proof_type_id: String,
    pub proof_idx: i16,
}
