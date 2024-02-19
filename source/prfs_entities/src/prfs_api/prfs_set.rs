use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::PrfsSetIns1;
use crate::entities::{PrfsSet, PrfsSetType};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetBySetIdRequest {
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetBySetIdResponse {
    pub prfs_set: PrfsSet,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetsRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetsResponse {
    pub page_idx: i32,
    pub page_size: i32,
    pub prfs_sets: Vec<PrfsSet>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetsBySetTypeRequest {
    pub page_idx: i32,
    pub page_size: i32,
    pub set_type: PrfsSetType,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsSetRequest {
    pub prfs_set_ins1: PrfsSetIns1,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsSetResponse {
    pub set_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsDynamicSetElementRequest {
    pub set_id: String,
    pub val: String,
    pub meta: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsDynamicSetElementResponse {
    #[ts(type = "number")]
    pub pos_w: Decimal,
}

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export)]
// pub struct ComputePrfsSetMerkleRootRequest {
//     pub set_id: String,
//     pub account_id: String,
// }

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ComputePrfsSetMerkleRootResponse {
    pub set_id: String,
    pub merkle_root: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateTreeOfPrfsSetRequest {
    pub set_id: String,
    pub tree_id: String,
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateTreeOfPrfsSetResponse {
    pub set_id: String,
}
