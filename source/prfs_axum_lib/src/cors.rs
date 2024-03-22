use axum::http::StatusCode;
use axum::response::Response;

use crate::{
    error::ApiHandleError,
    io::{full, BytesBoxBody},
};

pub fn handle_cors() -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let resp = Response::builder()
        .status(StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "*")
        .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        .body(full(""))
        .unwrap();

    Ok(resp)
}
