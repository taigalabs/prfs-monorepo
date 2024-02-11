use prfs_circuit_interface::circuit_types::{CircuitTypeData, CircuitTypeId};
use prfs_driver_interface::CircuitDriverId;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

use crate::entities::PrfsProofType;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypesRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofTypesResponse {
    pub next_offset: Option<i32>,
    pub rows: Vec<PrfsProofType>,
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
    pub circuit_id: String,
    #[ts(inline)]
    pub circuit_type_id: CircuitTypeId,
    #[ts(type = "Record<string, any>")]
    pub circuit_type_data: sqlx::types::Json<CircuitTypeData>,
    pub circuit_driver_id: CircuitDriverId,
    pub expression: String,
    pub img_url: Option<String>,
    pub img_caption: Option<String>,
    pub driver_properties: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofTypeResponse {
    pub id: i64,
}
