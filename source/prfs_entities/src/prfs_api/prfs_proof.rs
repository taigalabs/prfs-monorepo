use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofRequest {
    pub prfs_proof_id: String,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub serial_no: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    pub proof_type_id: String,
    pub nonce: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofResponse {
    pub prfs_proof_id: String,
}
