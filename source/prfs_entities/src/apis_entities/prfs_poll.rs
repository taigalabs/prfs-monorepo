use std::collections::HashMap;

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
    pub table_row_count: f32,
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
    pub description: String,

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

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SubmitPrfsPollResponseRequest {
    #[ts(type = "string")]
    pub poll_id: Uuid,

    #[ts(type = "string")]
    pub proof_instance_id: Uuid,

    pub serial_no: String,

    #[ts(type = "Record<string, string>[]")]
    pub value: sqlx::types::Json<HashMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SubmitPrfsPollResponseResponse {
    #[ts(type = "string")]
    pub poll_id: Uuid,
}
