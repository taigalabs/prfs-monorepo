use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::id_session::PrfsIdSession;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenPrfsIdSession2Request {
    pub key: String,
    pub value: Option<Vec<u8>>,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct OpenPrfsIdSession2Response {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionRequest {
    pub key: String,
    pub ticket: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct ClosePrfsIdSessionResponse {
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
pub struct GetPrfsIdSessionValueRequest {
    pub key: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct GetPrfsIdSessionValueResponse {
    pub session: Option<PrfsIdSession>,
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
