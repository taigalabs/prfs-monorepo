use chrono::{DateTime, Utc};
use prfs_db_lib::sqlx;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofInstance {
    pub proof_instance_id: String,
    pub proof_type_id: String,
    pub short_id: String,
    pub proof: Vec<u8>,
    #[ts(type = "Record<string, any>")]
    pub public_inputs: sqlx::types::Json<serde_json::Value>,
    pub prfs_ack_sig: String,
    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
