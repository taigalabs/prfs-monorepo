use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

use crate::entities::PrfsAccount;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpRequest {
    pub account_id: String,
    pub avatar_color: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpResponse {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInResponse {
    pub prfs_account: PrfsAccount,
}
