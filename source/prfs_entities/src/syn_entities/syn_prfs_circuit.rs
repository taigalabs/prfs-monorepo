use crate::entities::{CircuitInputMeta, CircuitInputType, RawCircuitInputMeta};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsCircuitSyn1 {
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

    pub circuit_input_types: Vec<CircuitInputType>,

    #[ts(type = "Record<string, any>[]")]
    pub raw_circuit_inputs_meta: sqlx::types::Json<Vec<RawCircuitInputMeta>>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
