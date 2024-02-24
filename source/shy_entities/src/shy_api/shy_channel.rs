use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsResponse {
    pub rows: Vec<ShyChannel>,
    pub next_offset: Option<i32>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyChannel {
    pub channel_id: String,
    pub label: String,

    #[ts(type = "string[]")]
    pub proof_type_ids: sqlx::types::Json<Vec<String>>,
}
