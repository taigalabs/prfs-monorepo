use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofInstanceSyn1 {
    pub id: Option<i64>,

    pub proof: Vec<u8>,
    pub proof_type_id: String,
    pub expression: String,
    pub img_url: String,
    pub circuit_id: String,
    pub driver_id: String,
    pub proof_desc: String,
    pub proof_label: String,

    #[ts(type = "Record<string, any>")]
    pub public_inputs: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
