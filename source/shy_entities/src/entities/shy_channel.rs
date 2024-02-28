use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyChannel {
    pub channel_id: String,
    pub label: String,
    pub locale: String,
    pub desc: String,

    #[ts(type = "string[]")]
    pub proof_type_ids: sqlx::types::Json<Vec<String>>,
}
