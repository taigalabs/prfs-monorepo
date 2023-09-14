use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsPoll {
    #[ts(type = "string")]
    pub poll_id: Uuid,

    pub label: String,
    pub plural_voting: bool,
    pub proof_type_id: String,
    pub author: String,

    #[ts(type = "Record<string, any>[]")]
    pub questions: sqlx::types::Json<Vec<PollQuestion>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PollQuestion {
    label: String,
}
