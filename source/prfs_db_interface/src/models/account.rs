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
