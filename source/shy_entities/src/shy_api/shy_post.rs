use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::{DateTimed, ShyTopic};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyTopicRequest {
    pub title: String,
    pub topic_id: String,
    pub content: String,
    pub channel_id: String,
    pub shy_topic_proof_id: String,
    pub proof_identity_input: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub author_public_key: String,
    pub serial_no: String,
    pub author_sig: String,
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
    pub shy_topics: Vec<DateTimed<ShyTopic>>,
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
