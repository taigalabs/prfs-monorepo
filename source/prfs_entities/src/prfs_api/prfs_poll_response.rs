use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsPollResponse;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollResultByPollIdResponse {
    pub prfs_poll_responses: Vec<PrfsPollResponse>,
}
