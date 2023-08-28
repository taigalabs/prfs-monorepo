use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::{PrfsSet, PrfsSetType};

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
    #[ts(type = "'<Uuid>' | string")]
    pub set_id: Uuid,
    pub set_type: PrfsSetType,
    pub label: String,
    pub author: String,
    pub desc: String,
    pub hash_algorithm: String,
    pub cardinality: i64,
    pub merkle_root: String,
    pub element_type: String,
    pub finite_field: String,
    pub elliptic_curve: String,
}
