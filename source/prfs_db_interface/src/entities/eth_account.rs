use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct EthAccount {
    pub addr: String,
    pub wei: Decimal,
}

impl EthAccount {
    pub fn table_name() -> &'static str {
        "eth_accounts"
    }
}
