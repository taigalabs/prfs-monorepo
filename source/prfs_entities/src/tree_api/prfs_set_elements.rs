use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsSetElement;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ImportPrfsAttestationsToPrfsSetRequest {
    // pub src_type: String,
    // pub src_id: String,
    pub topic: String,
    pub dest_set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ImportPrfsAttestationsToPrfsSetResponse {
    pub set_id: String,
    pub rows_affected: u64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetElementsRequest {
    pub offset: i32,
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetElementsResponse {
    pub rows: Vec<PrfsSetElement>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetElementRequest {
    pub label: String,
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetElementResponse {
    pub prfs_set_element: PrfsSetElement,
}
