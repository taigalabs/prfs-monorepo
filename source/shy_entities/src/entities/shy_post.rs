use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    pub title: String,
    pub post_id: String,
    pub content: String,
    pub channel_id: String,
    pub shy_post_proof_id: String,
    pub proof_identity_input: String,
    pub num_replies: i32,
    pub public_key: String,
}
