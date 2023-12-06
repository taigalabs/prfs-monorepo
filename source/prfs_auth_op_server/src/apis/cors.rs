// use hyper::{Response, StatusCode};
// use hyper_utils::io::{full, BytesBoxBody};

// use crate::AuthOpServerError;

// pub fn handle_cors() -> Result<Response<BytesBoxBody>, AuthOpServerError> {
//     let resp = Response::builder()
//         .status(StatusCode::OK)
//         .header("Access-Control-Allow-Origin", "*")
//         .header("Access-Control-Allow-Headers", "*")
//         .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
//         .body(full(""))
//         .unwrap();

//     Ok(resp)
// }
