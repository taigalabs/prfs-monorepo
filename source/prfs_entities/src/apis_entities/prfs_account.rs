use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpRequest {
    pub sig: String,
    pub avatarColor: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct SignUpResponse {
    pub id: String,
    pub sig: String,
}
