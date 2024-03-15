use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::ShyAccount;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpShyAccountRequest {
    pub account_id: String,
    pub avatar_color: String,
    pub public_key: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpShyAccountResponse {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInShyAccountRequest {
    pub account_id: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignInShyAccountResponse {
    pub shy_account: ShyAccount,
}
