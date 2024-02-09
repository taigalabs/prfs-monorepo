use crate::entities::{CircuitInputMeta, RawCircuitInputMeta};
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
    pub circuit_driver_id: String,
    pub driver_version: String,

    #[ts(type = "Record<string, string>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,

    #[ts(type = "Record<string, string>")]
    pub build_properties: sqlx::types::Json<HashMap<String, String>>,

    #[ts(type = "Record<string, any>[]")]
    pub circuit_inputs_meta: sqlx::types::Json<Vec<CircuitInputMeta>>,

    #[ts(type = "Record<string, any>[]")]
    pub raw_circuit_inputs_meta: sqlx::types::Json<Vec<RawCircuitInputMeta>>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}
