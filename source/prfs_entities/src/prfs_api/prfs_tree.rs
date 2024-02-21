use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsTree;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsTreeByPrfsSetRequest {
    pub set_id: String,
    pub tree_label: String,
    pub tree_id: String,
    pub account_id: String,
    // pub tree_depth: i16,
    // pub finite_field: String,
    // pub elliptic_curve: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsTreeByPrfsSetResponse {
    pub tree_id: String,
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetLatestPrfsTreeBySetIdRequest {
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetLatestPrfsTreeBySetIdResponse {
    pub prfs_tree: Option<PrfsTree>,
}
