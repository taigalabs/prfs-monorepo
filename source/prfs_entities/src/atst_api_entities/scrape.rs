use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ScrapeTwitterRequest {
    pub tweet_url: String,
    pub twitter_handle: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ScrapeTwitterResponse {
    pub is_valid: bool,
}
