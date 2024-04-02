use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::TwitterAccValidation;
use crate::atst_entities::PrfsAccAtst;

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export)]
// pub struct ValidateTwitterAccRequest {
//     pub tweet_url: String,
//     pub twitter_handle: String,
// }

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export)]
// pub struct ValidateTwitterAccResponse {
//     pub is_valid: bool,
//     pub validation: TwitterAccValidation,
// }
