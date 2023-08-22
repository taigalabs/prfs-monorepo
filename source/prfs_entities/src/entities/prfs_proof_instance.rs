use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofInstance {
    #[ts(type = "string")]
    pub proof_instance_id: Uuid,

    #[ts(type = "string")]
    pub proof_type_id: Uuid,

    pub short_id: String,

    pub proof: Vec<u8>,

    #[ts(type = "Record<string, any>")]
    pub public_inputs: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
