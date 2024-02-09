use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

use crate::entities::PrfsIdSession;

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionMsg {
    OpenPrfsIdSession(OpenPrfsIdSessionMsgPayload),
    ClosePrfsIdSession(ClosePrfsIdSessionMsgPayload),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsIdSessionResponse {
    pub error: Option<String>,
    pub payload: Option<PrfsIdSessionResponsePayload>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenPrfsIdSessionMsgPayload {
    pub key: String,
    pub value: Option<Vec<u8>>,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionMsgPayload {
    pub key: String,
    pub ticket: String,
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionResponsePayload {
    OpenPrfsIdSessionResult(OpenPrfsIdSessionResult),
    ClosePrfsIdSessionResult(ClosePrfsIdSessionResult),
    PutPrfsIdSessionValueResult(PutPrfsIdSessionValueResult),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenPrfsIdSessionResult {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionResult {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutPrfsIdSessionValueResult {
    pub key: String,
    pub value: Vec<u8>,
}
