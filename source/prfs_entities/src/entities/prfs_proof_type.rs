use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::Type;
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsProofType {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub expression: String,
    pub img_url: Option<String>,
    pub img_caption: Option<String>,
    pub circuit_id: String,
    pub circuit_type_id: String,
    pub circuit_driver_id: String,
    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

// #[derive(Debug, Serialize, Deserialize, Clone, TS)]
// #[ts(export)]
// pub struct CircuitInput {
//     pub name: String,
//     pub label: String,
//     pub r#type: CircuitInputType,
//     pub desc: String,
//     pub value: String,
//     #[serde(default = "default_units")]
//     pub units: i16,
//     pub element_type: Option<String>,
//     pub ref_type: Option<String>,
//     pub ref_value: Option<String>,
// }

fn default_units() -> i16 {
    1
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[sqlx(type_name = "VARCHAR")]
#[allow(non_camel_case_types)]
#[ts(export)]
pub enum CircuitInputType {
    HASH_DATA_1,
    MERKLE_PROOF_1,
    SIG_DATA_1,
    PASSCODE,
    PASSCODE_CONFIRM,
    MERKLE_SIG_POS_RANGE_V1,
}
