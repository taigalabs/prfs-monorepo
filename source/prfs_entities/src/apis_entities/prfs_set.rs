use crate::entities::PrfsSet;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
pub struct GetPrfsSetBySetIdRequest {
    #[ts(type = "string")]
    pub set_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetPrfsSetBySetIdResponse {
    pub prfs_set: PrfsSet,
}
