use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{PrfsProof, PrfsProofSyn1};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofRequest {
    pub prfs_proof_id: String,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub serial_no: String,

    pub proof_type_id: String,
    pub nonce: String,

    pub proof_public_key: String,
    pub proof_sig: String,
    pub proof_sig_msg: Vec<u8>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofResponse {
    pub prfs_proof_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofByProofIdRequest {
    pub prfs_proof_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofByProofIdResponse {
    pub prfs_proof: PrfsProofSyn1,
}
