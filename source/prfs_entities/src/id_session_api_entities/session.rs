use std::marker::PhantomData;

use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionMsg {
    OPEN_SESSION(OpenSessionMsgPayload),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsIdSessionResponse {
    pub error: Option<String>,
    pub payload: Option<PrfsIdSessionResponsePayload>,
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

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutSessionValueRequest {
    pub key: String,
    pub value: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutSessionValueResponse {
    // pub r#type: PrfsidSessionApiResponseType,
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DeleteSessionValueRequest {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct DeleteSessionValueResponse {
    pub key: String,
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiRequest {
    PUT_SESSION_VAL(PutSessionValueRequest),
    DELETE_SESSION_VAL(DeleteSessionValueRequest),
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsidSessionApiResponseType {
    PUT_SESSION_VAL,
    DELETE_SESSION_VAL,
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    PUT_SESSION_VAL(PutSessionValueResponse),
    DELETE_SESSION_VAL(DeleteSessionValueResponse),
}
