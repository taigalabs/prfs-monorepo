use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsAccount;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpPrfsAccountRequest {
    pub account_id: String,
    pub avatar_color: String,
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpPrfsAccountResponse {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInPrfsAccountRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInPrfsAccountResponse {
    pub prfs_account: PrfsAccount,
}
