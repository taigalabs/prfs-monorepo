use chrono::{DateTime, Utc};
use prfs_db_lib::sqlx;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuit {
    pub circuit_id: String,
    pub circuit_type_id: String,
    pub label: String,
    pub desc: String,
    pub author: String,
    pub num_public_inputs: i16,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
    #[ts(type = "Record<string, string>")]
    pub build_properties: sqlx::types::Json<HashMap<String, String>>,
    pub circuit_driver_id: String,
    pub driver_version: String,
    #[ts(type = "Record<string, string>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,
    #[ts(type = "Record<string, any>[]")]
    pub raw_circuit_inputs_meta: sqlx::types::Json<Vec<RawCircuitInputMeta>>,
    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct CircuitGeneratedPublicInput {
    pub name: String,
    pub r#type: String,
    pub label: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct RawCircuitInputMeta {
    pub r#type: String,
    pub label: String,
    pub desc: String,

    #[serde(default = "default_public")]
    pub public: bool,
}

fn default_public() -> bool {
    false
}
