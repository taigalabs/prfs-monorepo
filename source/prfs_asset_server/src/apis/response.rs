// use hyper::{body::Body, header, Response, StatusCode};
// use hyper_014::body::HttpBody;
// use hyper_utils::io::BytesBoxBody;
// use serde::{de::DeserializeOwned, Deserialize, Serialize};

// #[derive(Serialize, Deserialize, Debug)]
// pub enum ResponseCode {
//     SUCCESS,

//     ERROR,
// }

// #[derive(Serialize, Deserialize, Debug)]
// #[serde(rename_all = "camelCase")]
// pub struct AssetResponse<T> {
//     pub code: ResponseCode,
//     pub error: Option<String>,
//     pub payload: T,
// }

// impl<T: Serialize + DeserializeOwned> AssetResponse<T> {
//     pub fn new_success(payload: T) -> AssetResponse<T> {
//         AssetResponse {
//             code: ResponseCode::SUCCESS,
//             error: None,
//             payload,
//         }
//     }

//     pub fn into_hyper_response(self) -> Response<BytesBoxBody> {
//         if let Some(_err) = &self.error {
//             let data = serde_json::to_vec(&self).unwrap();

//             let resp = Response::builder()
//                 .status(StatusCode::BAD_REQUEST)
//                 .body(Body::from(data))
//                 .unwrap();

//             return resp;
//         } else {
//             let data = serde_json::to_vec(&self).unwrap();

//             let resp = Response::builder()
//                 .header(header::CONTENT_TYPE, "application/json")
//                 .body(Body::from(data))
//                 .unwrap();

//             return resp;
//         }
//     }
// }

// impl AssetResponse<String> {
//     pub fn new_error(err: String) -> AssetResponse<String> {
//         AssetResponse {
//             code: ResponseCode::ERROR,
//             error: Some(err),
//             payload: String::from(""),
//         }
//     }
// }
