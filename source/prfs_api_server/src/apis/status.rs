use http_body_util::Full;
use hyper::{body::Incoming, header, Request, Response, StatusCode};
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use std::sync::Arc;

use crate::{server::types::ApiHandlerResult, ApiServerError};

pub async fn handle_server_status(
    _req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let data = serde_json::json!({
        "commit_hash": state.commit_hash.to_string(),
        "launch_time": state.launch_time.to_string(),
    });

    let resp = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(data.to_string()))
        .unwrap();

    Ok(resp)
}
