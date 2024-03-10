use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::{DateTimed, ShyTopic};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsOfTopicRequest {
    pub topic_id: String,
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsOfTopicResponse {
    pub shy_topic: DateTimed<ShyTopic>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostRequest {
    pub topic_id: String,
    pub channel_id: String,
    pub shy_topic_proof_id: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub post_id: String,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostResponse {
    pub post_id: String,
}
