use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyChannel;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetShyChannelsResponse {
    pub rows: Vec<ShyChannel>,
    pub next_offset: Option<i32>,
}