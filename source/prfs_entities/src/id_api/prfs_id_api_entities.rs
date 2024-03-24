use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::{
    SignInPrfsIdentityRequest, SignInPrfsIdentityResponse, SignUpPrfsIdentityRequest,
    SignUpPrfsIdentityResponse,
};
use crate::{GetPrfsIdAppRequest, GetPrfsIdAppResponse};

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdApiRequest {
    get_prfs_id_app(GetPrfsIdAppRequest),
    sign_in_prfs_identity(SignInPrfsIdentityRequest),
    sign_up_prfs_identity(SignUpPrfsIdentityRequest),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdApiResponse {
    get_prfs_id_app(GetPrfsIdAppResponse),
    sign_up_prfs_identity(SignUpPrfsIdentityResponse),
    sign_in_prfs_identity(SignInPrfsIdentityResponse),
}
