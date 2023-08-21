use super::{CircuitInputMeta, DriverPropertyMeta};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuit {
    #[ts(type = "string")]
    pub circuit_id: Uuid,

    pub circuit_type: String,
    pub label: String,
    pub desc: String,
    pub author: String,
    pub num_public_inputs: u32,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
    pub driver_id: String,
    pub driver_version: String,

    #[ts(type = "Record<string, string>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,

    #[ts(type = "Record<string, any>[]")]
    pub circuit_inputs_meta: sqlx::types::Json<Vec<CircuitInputMeta>>,

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

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitDriver {
    pub driver_id: String,
    pub driver_repository_url: String,
    pub version: String,
    pub author: String,
    pub desc: String,

    #[ts(type = "string[]")]
    pub circuit_types: sqlx::types::Json<Vec<String>>,

    #[ts(type = "Record<string, any>[]")]
    pub driver_properties_meta: sqlx::types::Json<Vec<DriverPropertyMeta>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

fn default_public() -> bool {
    false
}
