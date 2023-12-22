use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ScrapeTwitterRequest {}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ScrapeTwitterResponse {}
