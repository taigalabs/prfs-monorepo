use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsIdentity;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsIdentitySignUpRequest {
    pub identity_id: String,
    pub avatar_color: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsIdentitySignUpResponse {
    pub identity_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsIdentitySignInRequest {
    pub identity_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsIdentitySignInResponse {
    pub prfs_identity: PrfsIdentity,
}
