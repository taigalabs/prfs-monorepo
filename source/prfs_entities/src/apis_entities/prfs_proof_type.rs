use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::{CircuitInput, PrfsProofType, PrfsSet};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypesRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypesResponse {
    pub page_idx: i32,
    pub prfs_proof_types: Vec<PrfsProofType>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypeByProofTypeIdRequest {
    pub proof_type_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypeByProofTypeIdResponse {
    pub prfs_proof_type: PrfsProofType,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofTypeRequest {
    pub proof_type_id: String,
    pub author: String,
    pub label: String,
    pub desc: String,

    #[ts(type = "'<Uuid>' | string")]
    pub circuit_id: Uuid,
    pub circuit_type_id: String,
    pub circuit_driver_id: String,
    pub expression: String,
    pub img_url: Option<String>,
    pub img_caption: Option<String>,
    pub circuit_inputs: Vec<CircuitInput>,
    pub driver_properties: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofTypeResponse {
    pub id: i64,
}
