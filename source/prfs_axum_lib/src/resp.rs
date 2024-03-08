use hyper::{header, Response, StatusCode};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::{
    io::{full, BytesBoxBody},
    ApiHandleErrorCode,
};

pub const API_HANDLE_SUCCESS_CODE: &'static str = "2000000";

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse<P> {
    pub code: String,
    pub error: Option<String>,
    pub payload: Option<P>,
}

impl<P: Serialize + DeserializeOwned> ApiResponse<P> {
    pub fn new_success(payload: P) -> ApiResponse<P> {
        ApiResponse {
            code: API_HANDLE_SUCCESS_CODE.to_string(),
            error: None,
            payload: Some(payload),
        }
    }

    pub fn into_hyper_response(self) -> Response<BytesBoxBody> {
        let resp = Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
            .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
            .header(header::ACCESS_CONTROL_ALLOW_METHODS, "*");

        if let Some(_err) = &self.error {
            let data = serde_json::to_vec(&self).unwrap();

            return resp
                .status(StatusCode::BAD_REQUEST)
                .body(full(data))
                .unwrap();
        } else {
            let data = serde_json::to_vec(&self).unwrap();

            return resp.status(StatusCode::OK).body(full(data)).unwrap();
        }
    }

    pub fn new_error(error_code: &ApiHandleErrorCode, err: String) -> ApiResponse<P> {
        ApiResponse {
            code: error_code.code.to_string(),
            error: Some(err),
            payload: None,
        }
    }
}
