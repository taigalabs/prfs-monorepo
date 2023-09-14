use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::{
    entities::{PollQuestion, PrfsPoll, PrfsProofInstance, PrfsSet},
    syn_entities::PrfsProofInstanceSyn1,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollsRequest {
    pub page_idx: i32,
    pub page_size: i32,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollsResponse {
    pub page_idx: i32,
    pub prfs_polls: Vec<PrfsPoll>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsPollRequest {
    #[ts(type = "string")]
    pub poll_id: Uuid,

    pub label: String,
    pub plural_voting: bool,
    pub proof_type_id: String,
    pub author: String,

    #[ts(type = "Record<string, any>[]")]
    pub questions: sqlx::types::Json<Vec<PollQuestion>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsPollResponse {
    #[ts(type = "string")]
    pub poll_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollByPollIdRequest {
    #[ts(type = "string")]
    pub poll_id: Uuid,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsPollByPollIdResponse {
    pub prfs_poll: PrfsPoll,
}
