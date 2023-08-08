use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize)]
#[ts(export)]
pub struct EthAccount {
    pub addr: String,

    #[ts(type = "number")]
    pub wei: Decimal,
}

// impl EthAccount {
//     pub fn table_name() -> &'static str {
//         "eth_accounts"
//     }
// }
