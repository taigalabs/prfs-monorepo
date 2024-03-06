use chrono::{DateTime, Utc};
use prfs_db_lib::sqlx;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::CircuitInputMeta;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuitType {
    pub circuit_type_id: String,
    pub desc: String,
    pub author: String,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,

    #[ts(type = "Record<string, any>[]")]
    pub circuit_inputs_meta: sqlx::types::Json<Vec<CircuitInputMeta>>,

    #[ts(type = "Record<string, any>[]")]
    pub public_inputs_meta: sqlx::types::Json<Vec<PublicInputMeta>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PublicInputMeta {
    pub name: String,
    pub label: String,
    pub r#type: String,
    pub desc: String,

    #[serde(default = "default_show_priority")]
    pub show_priority: i16,
}

fn default_show_priority() -> i16 {
    3
}
