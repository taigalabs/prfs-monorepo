use super::CircuitInputMeta;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuit {
    pub circuit_id: String,
    pub label: String,
    pub desc: String,
    pub author: String,
    pub circuit_dsl: String,
    pub arithmetization: String,
    pub proof_algorithm: String,
    pub elliptic_curve: String,
    pub finite_field: String,
    pub circuit_inputs_meta: Vec<CircuitInputMeta>,
    pub circuit_public_inputs_meta: Vec<CircuitInputMeta>,
    pub driver_id: String,
    pub driver_version: String,

    #[ts(type = "Record<string, any>")]
    pub driver_properties: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitDriver {
    pub driver_id: String,
    pub driver_repository_url: String,
    pub version: String,
    pub author: String,

    #[ts(type = "Record<string, string>")]
    pub properties_meta: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}
