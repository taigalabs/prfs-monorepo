use hyper::{header, Body, Response, StatusCode};
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

    pub fn into_hyper_response(self) -> Response<Body> {
        if let Some(_err) = &self.error {
            let data = serde_json::to_vec(&self).unwrap();

            let resp = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from(data))
                .unwrap();

            return resp;
        } else {
            let data = serde_json::to_vec(&self).unwrap();

            let resp = Response::builder()
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(data))
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
