use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS, Clone, Debug, Serialize, Deserialize, sqlx::Type, EnumString, Display)]
#[ts(export)]
#[sqlx(type_name = "VARCHAR")]
pub enum PrfsAtstStatus {
    Valid,
    Invalid,
}
