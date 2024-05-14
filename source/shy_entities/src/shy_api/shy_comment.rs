use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    entities::{DateTimed, ShyComment},
    ProofBlob, ShyCommentWithProofs,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyCommentsOfTopicRequest {
    pub topic_id: String,
    pub channel_id: String,
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyCommentsOfTopicResponse {
    pub rows: Vec<DateTimed<ShyCommentWithProofs>>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyCommentRequest {
    pub topic_id: String,
    pub channel_id: String,
    pub shy_proof_id: String,
    pub comment_id: String,
    pub content: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    pub other_proofs: Vec<ProofBlob>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyCommentWithProofsRequest {
    pub topic_id: String,
    pub channel_id: String,
    // pub shy_proof_id: String,
    pub comment_id: String,
    pub content: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    // pub proof_identity_input: String,
    // pub proof: Vec<u8>,
    // pub public_inputs: String,
    // pub serial_no: String,
    pub sub_channel_id: String,
    // pub proof_type_id: String,
    // pub proof_idx: i16,
    pub proofs: Vec<ProofBlob>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyCommentResponse {
    pub comment_id: String,
}
