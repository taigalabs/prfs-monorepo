// use hyper::{header, Response, StatusCode};
// use hyper_utils::io::{full, BytesBoxBody};
// use serde::{de::DeserializeOwned, Deserialize, Serialize};

// #[derive(Serialize, Deserialize, Debug)]
// pub enum ResponseCode {
//     SUCCESS,
//     ERROR,
// }

// #[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
// pub struct ApiResponse<T> {
//     pub code: ResponseCode,
//     pub error: Option<String>,
//     pub payload: Option<T>,
// }

// impl<T: Serialize + DeserializeOwned> ApiResponse<T> {
//     pub fn new_success(payload: T) -> ApiResponse<T> {
//         ApiResponse {
//             code: ResponseCode::SUCCESS,
//             error: None,
//             payload: Some(payload),
//         }
//     }

//     pub fn into_hyper_response(self) -> Response<BytesBoxBody> {
//         let resp = Response::builder()
//             .header(header::CONTENT_TYPE, "application/json")
//             .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
//             .header(header::ACCESS_CONTROL_ALLOW_HEADERS, "*")
//             .header(header::ACCESS_CONTROL_ALLOW_METHODS, "*");

//         if let Some(_err) = &self.error {
//             let data = serde_json::to_vec(&self).unwrap();

//             return resp
//                 .status(StatusCode::BAD_REQUEST)
//                 .body(full(data))
//                 .unwrap();
//         } else {
//             let data = serde_json::to_vec(&self).unwrap();

//             return resp.status(StatusCode::OK).body(full(data)).unwrap();
//         }
//     }
// }

// impl ApiResponse<String> {
//     pub fn new_error(err: String) -> ApiResponse<String> {
//         ApiResponse {
//             code: ResponseCode::ERROR,
//             error: Some(err),
//             payload: None,
//         }
//     }
// }
