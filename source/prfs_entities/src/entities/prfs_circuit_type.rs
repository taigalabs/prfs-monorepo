use super::CircuitInputMeta;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuitType {
    pub circuit_type: CircuitType,
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

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[ts(export)]
pub enum CircuitType {
    MEMBERSHIP_PROOF_1,
    SIMPLE_HASH_1,
}
