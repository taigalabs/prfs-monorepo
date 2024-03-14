use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::id_entities::{PrfsIdentity, PrfsIdentityType};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpPrfsIdentityRequest {
    pub identity_id: String,
    pub public_key: String,
    pub avatar_color: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpPrfsIdentityResponse {
    pub identity_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInPrfsIdentityRequest {
    pub identity_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInPrfsIdentityResponse {
    pub prfs_identity: PrfsIdentity,
}
