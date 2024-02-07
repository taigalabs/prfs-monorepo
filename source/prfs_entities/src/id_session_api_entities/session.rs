use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionMsg {
    OPEN_SESSION(OpenSessionMsgPayload),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsIdSessionResponse {
    pub error: Option<String>,
    pub payload: PrfsIdSessionResponsePayload,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(untagged)]
#[ts(export)]
pub enum PrfsIdSessionResponsePayload {
    OpenSessionResult(String),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenSessionMsgPayload {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenSessionResult {
    pub key: String,
}

// #[derive(Debug, Serialize, Deserialize, Clone, TS)]
// #[ts(export)]
// pub struct SignInSuccessPayload {
//     account_id: String,
//     public_key: String,
// }

// #[derive(Debug, Serialize, Deserialize, Clone, TS)]
// #[ts(export)]
// pub struct ProofGenSuccessPayload {
//     #[ts(type = "Record<string, any>")]
//     receipt: serde_json::Value,
// }

// #[derive(Debug, Serialize, Deserialize, Clone, TS)]
// #[ts(export)]
// pub struct VerifyProofSuccessPayload {
//     is_verified: bool,
// }
