use chrono::{DateTime, Utc};
use prfs_db_lib::sqlx;
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
    pub description: String,

    #[ts(type = "Record<string, any>[]")]
    pub questions: sqlx::types::Json<Vec<PollQuestion>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PollQuestion {
    label: String,
    r#type: PollQuestionType,
    required: bool,

    #[ts(type = "Record<string, any>[]")]
    choices: sqlx::types::Json<Vec<PollQuestionChoice>>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub enum PollQuestionType {
    MultipleChoice,
    Checkboxes,
    Text,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PollQuestionChoice {
    label: String,
}
