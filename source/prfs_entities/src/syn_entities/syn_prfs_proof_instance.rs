use crate::entities::PublicInputMeta;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofInstanceSyn1 {
    #[ts(type = "string")]
    pub proof_instance_id: Uuid,

    pub proof_type_id: String,

    pub proof: Vec<u8>,
    pub short_id: String,
    pub expression: String,
    pub img_url: Option<String>,
    pub img_caption: Option<String>,

    #[ts(type = "string")]
    pub circuit_id: Uuid,
    pub circuit_type_id: String,
    pub circuit_driver_id: String,
    pub proof_type_desc: String,
    pub proof_type_label: String,
    pub prfs_ack_sig: String,

    #[ts(type = "Record<string, any>[]")]
    pub public_inputs_meta: sqlx::types::Json<Vec<PublicInputMeta>>,

    #[ts(type = "Record<string, any>")]
    pub public_inputs: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,

    pub proof_type_author: String,
    pub circuit_desc: String,
    pub circuit_author: String,

    #[ts(type = "string")]
    pub proof_type_created_at: DateTime<Utc>,
}
