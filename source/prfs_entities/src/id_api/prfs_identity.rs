use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsAccount;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSignUpRequest {
    pub account_id: String,
    pub public_key: String,
    pub avatar_color: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSignUpResponse {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSignInRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSignInResponse {
    pub prfs_account: PrfsAccount,
}
