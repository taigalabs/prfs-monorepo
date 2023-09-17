use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsPollResponse {
    #[ts(type = "string")]
    pub poll_id: Uuid,

    #[ts(type = "string")]
    pub proof_instance_id: Uuid,
    pub serial_no: String,

    #[ts(type = "string[]")]
    pub value: sqlx::types::Json<Vec<String>>,
}
