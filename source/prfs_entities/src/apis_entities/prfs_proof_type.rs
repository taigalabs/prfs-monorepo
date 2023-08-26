use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::{CircuitInput, PrfsProofType, PrfsSet};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypesRequest {
    pub page: u32,

    #[ts(type = "'<Uuid>' | string | null")]
    pub proof_type_id: Option<Uuid>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypeResponse {
    pub page: u32,
    pub prfs_proof_types: Vec<PrfsProofType>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofTypesRequest {
    #[ts(type = "'<Uuid>' | string")]
    pub proof_type_id: Uuid,
    pub author: String,
    pub label: String,
    pub desc: String,

    #[ts(type = "'<Uuid>' | string")]
    pub circuit_id: Uuid,
    pub circuit_type: String,
    pub circuit_driver_id: String,
    pub expression: String,
    pub img_url: Option<String>,
    pub img_caption: Option<String>,
    pub circuit_inputs: Vec<CircuitInput>,
    pub driver_properties: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofTypesResponse {
    pub id: i64,
}
