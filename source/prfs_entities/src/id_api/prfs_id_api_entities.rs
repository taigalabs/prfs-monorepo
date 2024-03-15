use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    SignInPrfsIdentityRequest, SignInPrfsIdentityResponse, SignUpPrfsIdentityRequest,
    SignUpPrfsIdentityResponse,
};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdApiRequest {
    sign_in_prfs_identity(SignInPrfsIdentityRequest),
    sign_up_prfs_identity(SignUpPrfsIdentityRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdApiResponse {
    sign_up_prfs_identity(SignUpPrfsIdentityResponse),
    sign_in_prfs_identity(SignInPrfsIdentityResponse),
}
