use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsPollResponse;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollResultByPollIdResponse {
    pub prfs_poll_responses: Vec<PrfsPollResponse>,
}
