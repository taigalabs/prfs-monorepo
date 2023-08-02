use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PrfsProofType {
    pub proof_type_id: String,
    pub label: String,
    pub author: String,
    pub desc: String,

    pub circuit_id: String,
    pub program_id: String,
    pub public_input_instance: String,
    pub program_properties: String,

    pub created_at: NaiveDate,
}
