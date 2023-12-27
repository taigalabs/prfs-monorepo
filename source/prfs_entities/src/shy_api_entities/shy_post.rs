use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostRequest {
    pub post: ShyPost,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateShyPostResponse {
    #[ts(type = "string")]
    pub post_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyPostsResponse {
    pub shy_posts: Vec<ShyPost>,
    pub next_offset: Option<i32>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    #[ts(type = "string")]
    pub post_id: Uuid,

    pub content: String,
    pub channel_id: String,
}
