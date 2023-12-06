use hyper::{Response, StatusCode};

use crate::io::{full, BytesBoxBody};
use crate::HyperUtilsError;

pub fn handle_cors() -> Result<Response<BytesBoxBody>, HyperUtilsError> {
    let resp = Response::builder()
        .status(StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "*")
        .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        .body(full(""))
        .unwrap();

    Ok(resp)
}
