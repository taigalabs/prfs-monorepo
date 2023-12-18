use hyper::{header, Response, StatusCode};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::{
    error::ApiHandleError,
    io::{full, BytesBoxBody},
};

// impl std::error::Error for ApiHandleErrorCode {}

// #[derive(Serialize, Deserialize, Debug)]
// pub enum ResponseCode {
//     SUCCESS,
//     ERROR,
// }

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ApiResponse<P> {
    pub code: u32,
    pub error: Option<String>,
    pub payload: Option<P>,
}

impl<P: Serialize + DeserializeOwned> ApiResponse<P> {
    pub fn new_success(payload: P) -> ApiResponse<P> {
        ApiResponse {
            code: 200000,
            error: Some("Success".to_string()),
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
}

impl<P: Serialize + DeserializeOwned> ApiResponse<P> {
    pub fn new_error(err: ApiHandleError) -> ApiResponse<P> {
        let error = format!("{}, err: {}", err.0.phrase, err.1);

        ApiResponse {
            code: err.0.code,
            error: Some(error),
            payload: None,
        }
    }
}
