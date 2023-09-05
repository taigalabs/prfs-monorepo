use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    entities::{PrfsSet, PrfsSetType},
    ins_entities::PrfsSetIns1,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsSetBySetIdRequest {
    #[ts(type = "string")]
    pub set_id: Uuid,
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
    #[ts(type = "string")]
    pub set_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsDynamicSetElementRequest {
    #[ts(type = "string")]
    pub set_id: Uuid,
    pub val: String,
    pub meta: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsDynamicSetElementResponse {
    #[ts(type = "number")]
    pub pos_w: Decimal,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ComputePrfsSetMerkleRootRequest {
    #[ts(type = "string")]
    pub set_id: Uuid,
    pub account_sig: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ComputePrfsSetMerkleRootResponse {
    #[ts(type = "string")]
    pub set_id: Uuid,
    pub merkle_root: String,
}
