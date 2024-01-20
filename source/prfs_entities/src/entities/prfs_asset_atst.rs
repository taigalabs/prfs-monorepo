use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsAssetAtst {
    pub wallet_addr: String,
    #[ts(type = "bigint")]
    pub amount: Decimal,
    pub unit: String,
}
