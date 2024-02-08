use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::entities::PrfsIdSession;

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionApiRequest {
    GetPrfsIdSessionValue(GetPrfsIdSessionValueRequest),
    PutPrfsIdSessionValue(PutPrfsIdSessionValueRequest),
}

#[allow(non_camel_case_types)]
#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "snake_case")]
#[ts(export)]
pub enum PrfsIdSessionApiResponse {
    GetPrfsIdSessionValue(GetPrfsIdSessionValueResponse),
    PutPrfsIdSessionValue(PutPrfsIdSessionValueResponse),
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
    pub session: PrfsIdSession,
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
