use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::id_entities::PrfsIdApp;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsIdAppRequest {
    pub app_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsIdAppResponse {
    pub prfs_id_app: PrfsIdApp,
}
