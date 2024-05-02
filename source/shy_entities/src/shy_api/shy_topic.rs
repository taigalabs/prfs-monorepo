use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::{DateTimed, ShyTopic, ShyTopicSyn1};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyTopicRequest {
    pub title: String,
    pub topic_id: String,
    pub content: String,
    // pub content_hash: String,
    pub channel_id: String,
    pub shy_proof_id: String,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub serial_no: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    pub sub_channel_id: String,
    pub proof_type_id: String,
    pub proof_idx: i16,
    pub other_proofs: Vec<ProofBlob>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyTopicResponse {
    pub topic_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicsRequest {
    pub channel_id: String,
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicsResponse {
    pub shy_topics: Vec<DateTimed<ShyTopicSyn1>>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicRequest {
    pub topic_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyTopicResponse {
    pub shy_topic: DateTimed<ShyTopic>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ProofBlob {
    pub shy_proof_id: String,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub serial_no: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_sig_msg: Vec<u8>,
    pub proof_type_id: String,
    pub proof_idx: i16,
}
