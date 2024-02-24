use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    #[ts(type = "string")]
    pub post_id: Uuid,

    pub content: String,
    pub channel_id: String,
}
