use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionMsg {
    OpenPrfsIdSession(OpenPrfsIdSessionMsgPayload),
    ClosePrfsIdSession(ClosePrfsIdSessionMsgPayload),
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

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionApiRequest {
    PutPrfsIdSessionValue(PutPrfsIdSessionValueRequest),
    DeletePrfsIdSessionValue(DeletePrfsIdSessionValueRequest),
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    PutPrfsIdSessionValue(PutPrfsIdSessionValueResponse),
    DeletePrfsIdSessionValue(DeletePrfsIdSessionValueResponse),
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
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenPrfsIdSessionResult {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionMsgPayload {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionResult {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutPrfsIdSessionValueRequest {
    pub key: String,
    pub value: Vec<u8>,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutPrfsIdSessionValueResponse {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutPrfsIdSessionValueResult {
    pub key: String,
    pub value: Vec<u8>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DeletePrfsIdSessionValueRequest {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DeletePrfsIdSessionValueResponse {
    pub key: String,
}
