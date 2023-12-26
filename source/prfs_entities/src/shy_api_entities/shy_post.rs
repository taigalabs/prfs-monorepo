use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePostRequest {
    pub post: ShyPost,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePostResponse {
    #[ts(type = "string")]
    pub post_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPostsRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPostsResponse {
    pub next_idx: i32,
    pub social_posts: Vec<ShyPost>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    #[ts(type = "string")]
    pub post_id: Uuid,

    pub content: String,
    pub channel_id: String,
}
