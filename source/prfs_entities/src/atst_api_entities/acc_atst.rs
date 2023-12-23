use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsAccAtst;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct AttestTwitterAccRequest {
    pub acc_atst_id: String,
    pub tweet_url: String,
    pub twitter_handle: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct AttestTwitterAccResponse {
    pub is_valid: bool,
    pub acc_atst_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAccAtstsRequest {
    destination: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAccAtstsResponse {
    prfs_acc_atsts: Vec<PrfsAccAtst>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct InsertPrfsAccAtstRequest {
    prfs_acc_atst: PrfsAccAtst,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct InsertPrfsAccAtstResponse {
    pub acc_atst_id: String,
}
