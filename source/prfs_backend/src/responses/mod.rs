use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ApiErrorResponse {
    pub code: ResponseCode,
    pub error: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ResponseCode {
    SUCCESS,

    ERROR,
}
