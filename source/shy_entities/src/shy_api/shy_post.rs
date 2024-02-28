use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::{ShyPost, ShyPostProof};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostRequest {
    pub title: String,
    pub post_id: String,
    pub content: String,
    pub channel_id: String,
    pub shy_post_proof_id: String,
    pub proof: Vec<u8>,
    pub public_inputs: String,
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostResponse {
    pub post_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsRequest {
    pub channel_id: String,
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsResponse {
    pub shy_posts: Vec<ShyPost>,
    pub next_offset: Option<i32>,
}
