use chrono::{DateTime, Utc};
use prfs_circuit_interface::circuit_types::{CircuitTypeData, CircuitTypeId};
use prfs_driver_interface::CircuitDriverId;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofTypeSyn1 {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub expression: String,
    pub img_url: Option<String>,

    #[ts(optional)]
    pub img_caption: Option<String>,

    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
    pub experimental: bool,

    pub circuit_id: String,
    #[ts(inline)]
    pub circuit_type_id: CircuitTypeId,
    #[ts(type = "Record<string, any>")]
    pub circuit_type_data: sqlx::types::Json<CircuitTypeData>,
    #[ts(inline)]
    pub circuit_driver_id: CircuitDriverId,
    #[ts(type = "Record<string, string>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,
}
