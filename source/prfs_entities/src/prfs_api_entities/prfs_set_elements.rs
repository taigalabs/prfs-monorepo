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
pub struct ImportPrfsSetElementsRequest {
    destination_type: String,
    destination_id: String,
    set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ImportPrfsSetElementsResponse {
    set_id: String,
}
