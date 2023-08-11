use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofType {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,

    pub circuit_id: String,
    pub driver_id: String,

    #[ts(type = "Record<string, any>")]
    pub public_input_instance: sqlx::types::Json<HashMap<u32, PublicInputInstanceEntry>>,

    #[ts(type = "Record<string, any>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PublicInputInstanceEntry {
    pub label: String,
    pub r#type: String,
    pub desc: String,
    pub value: String,
    pub r#ref: Option<String>,
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

fn default_public() -> bool {
    false
}

fn default_ref() -> String {
    String::from("None")
}

// #[allow(non_camel_case_types)]
// #[derive(Debug, Serialize, Deserialize, Clone, TS, strum_macros::Display)]
// #[ts(export)]
// pub enum CircuitInputType {
//     PROVER_GENERATED,
//     PRFS_SET,
// }
