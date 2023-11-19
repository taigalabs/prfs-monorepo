use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::SocialPost;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateSocialPostRequest {
    pub post: SocialPost,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateSocialPostResponse {
    #[ts(type = "string")]
    pub post_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetSocialPostsRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetSocialPostsResponse {
    pub next_idx: i32,
    pub social_posts: Vec<SocialPost>,
}
