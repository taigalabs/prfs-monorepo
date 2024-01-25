use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    entities::{PrfsSet, PrfsSetType},
    syn_entities::PrfsSetIns1,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSetElement {}
