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
