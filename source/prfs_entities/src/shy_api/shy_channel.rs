use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export)]
// pub struct CreateShyPostRequest {
//     pub post: ShyPost,
// }

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export)]
// pub struct CreateShyPostResponse {
//     #[ts(type = "string")]
//     pub post_id: Uuid,
// }

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsResponse {
    pub shy_channels: Vec<ShyChannel>,
    pub next_offset: Option<i32>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyChannel {
    pub channel_id: String,
    pub label: String,

    #[ts(type = "string[]")]
    pub public_keys: sqlx::types::Json<Vec<String>>,
}
