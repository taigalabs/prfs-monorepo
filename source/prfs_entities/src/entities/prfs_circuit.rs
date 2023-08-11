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

    #[ts(type = "Record<string, any>[]")]
    pub circuit_inputs_meta: sqlx::types::Json<Vec<CircuitInputMeta>>,

    pub driver_id: String,
    pub driver_version: String,

    #[ts(type = "Record<string, any>")]
    pub driver_properties: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct CircuitInputMeta {
    pub r#type: String,
    pub label: String,
    pub desc: String,

    #[serde(default = "default_ref")]
    pub r#ref: String,

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

    #[ts(type = "Record<string, string>")]
    pub properties_meta: sqlx::types::Json<serde_json::Value>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,

    #[ts(type = "Record<string, any>[]")]
    pub prove_inputs_meta: sqlx::types::Json<Vec<ProveInputMeta>>,
}

// #[derive(Debug, Serialize, Deserialize, Clone, TS)]
// #[ts(export)]
// pub struct ProofFunctionDefinition {
//     label: String,

//     #[ts(type = "Record<string, any>[]")]
//     inputs: sqlx::types::Json<Vec<ProofFunctionInputMeta>>,
// }

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ProveInputMeta {
    pub r#type: String,
    pub label: String,
    pub desc: String,

    #[serde(default = "default_ref")]
    pub r#ref: String,
}

fn default_public() -> bool {
    false
}

fn default_ref() -> String {
    String::from("")
}
