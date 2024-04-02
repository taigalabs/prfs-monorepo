use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{atst_entities::PrfsAttestation, PrfsAtstTypeId};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAttestationsRequest {
    pub offset: i32,
    pub atst_type_id: PrfsAtstTypeId,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAttestationsResponse {
    pub rows: Vec<PrfsAttestation>,
    pub next_offset: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAttestationRequest {
    pub atst_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct GetPrfsAttestationResponse {
    pub prfs_attestation: PrfsAttestation,
}
