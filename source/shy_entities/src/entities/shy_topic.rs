use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyTopic {
    pub title: String,
    pub topic_id: String,
    pub channel_id: String,
    pub num_replies: i32,
    pub author_public_key: String,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyTopicPost {
    pub title: String,
    pub topic_id: String,
    pub channel_id: String,
    pub num_replies: i32,
    pub author_public_key: String,
    pub shy_topic_proof_id: String,
    pub proof_identity_input: String,
    pub author_sig: String,
}
