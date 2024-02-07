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
    CLOSE_SESSION(CloseSessionMsgPayload),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PrfsIdSessionResponse {
    pub error: Option<String>,
    pub payload: Option<PrfsIdSessionResponsePayload>,
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionResponsePayload {
    OPEN_SESSION_RESULT(OpenSessionResult),
    CLOSE_SESSION_RESULT(CloseSessionResult),
    PUT_SESSION_VALUE_RESULT(PutSessionValueResult),
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
pub struct CloseSessionMsgPayload {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CloseSessionResult {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct PutSessionValueRequest {
    pub key: String,
    pub value: Vec<u8>,
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
pub struct PutSessionValueResult {
    pub key: String,
    pub value: Vec<u8>,
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
    put_session_val(PutSessionValueRequest),
    delete_session_val(DeleteSessionValueRequest),
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    put_session_val(PutSessionValueResponse),
    delete_session_val(DeleteSessionValueResponse),
}
