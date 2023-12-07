use hyper::{header, Response, StatusCode};
use hyper_utils::io::{full, BytesBoxBody};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub enum ResponseCode {
    SUCCESS,

    ERROR,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ApiResponse<T> {
    pub code: ResponseCode,
    pub error: Option<String>,
    pub payload: T,
}

impl<T: Serialize + DeserializeOwned> ApiResponse<T> {
    pub fn new_success(payload: T) -> ApiResponse<T> {
        ApiResponse {
            code: ResponseCode::SUCCESS,
            error: None,
            payload,
        }
    }

    pub fn into_hyper_response(self) -> Response<BytesBoxBody> {
        if let Some(_err) = &self.error {
            let data = serde_json::to_vec(&self).unwrap();

            let resp = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(full(data))
                .unwrap();

            return resp;
        } else {
            let data = serde_json::to_vec(&self).unwrap();

            let resp = Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, "application/json")
                .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
                .header(header::ACCESS_CONTROL_ALLOW_METHODS, "*")
                // .header("Access-Control-Allow-Headers", "*")
                // .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .body(full(data))
                .unwrap();

            return resp;
        }
    }
}

impl ApiResponse<String> {
    pub fn new_error(err: String) -> ApiResponse<String> {
        ApiResponse {
            code: ResponseCode::ERROR,
            error: Some(err),
            payload: String::from(""),
        }
    }
}
