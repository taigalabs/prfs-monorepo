use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    pub title: String,
    pub post_id: String,
    pub content: String,
    pub channel_id: String,
}
