use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::PrfsAtstGroup;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAtstGroupsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAtstGroupsResponse {
    pub rows: Vec<PrfsAtstGroup>,
    pub next_offset: Option<i32>,
}
