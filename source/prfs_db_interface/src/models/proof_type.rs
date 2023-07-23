use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProofType {
    pub desc: String,
    pub label: String,
}

impl ProofType {
    pub fn table_name() -> &'static str {
        "proof_types"
    }
}
