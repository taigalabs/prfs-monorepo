use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Account {
    pub addr: String,
    pub wei: Decimal,
}

impl Account {
    pub fn table_name() -> &'static str {
        "accounts"
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Node {
    pub pos_w: Decimal,
    pub pos_h: i32,
    pub val: String,
    pub set_id: String,
}

impl Node {
    pub fn table_name() -> &'static str {
        "nodes"
    }
}

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
