use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

use crate::{atst_api::CryptoAsset, PrfsAtstGroupId, PrfsAtstVersion};

#[derive(TS, Debug, Serialize, Deserialize, Default, Clone)]
#[ts(export)]
pub struct PrfsAtstValue {
    pub label: String,
    pub value_raw: String,
    pub value_int: String,
}
