use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsProofRecord;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofRecordRequest {
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsProofRecordResponse {
    pub proof_record: Option<PrfsProofRecord>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofRecordRequest {
    pub proof_record: PrfsProofRecord,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreatePrfsProofRecordResponse {
    pub public_key: String,
}
