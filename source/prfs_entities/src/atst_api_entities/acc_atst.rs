use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsAccAtst;

use super::TwitterAccValidation;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValidateTwitterAccRequest {
    pub tweet_url: String,
    pub twitter_handle: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValidateTwitterAccResponse {
    pub is_valid: bool,
    pub validation: TwitterAccValidation,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct AttestTwitterAccRequest {
    pub acc_atst_id: String,
    pub validation: TwitterAccValidation,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct AttestTwitterAccResponse {
    pub is_valid: bool,
    pub acc_atst_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetTwitterAccAtstsRequest {
    pub offset: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetTwitterAccAtstsResponse {
    pub rows: Vec<PrfsAccAtst>,
    pub next_offset: Option<i32>,
}
