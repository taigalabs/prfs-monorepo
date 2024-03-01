use axum::{extract::State, Json};
use http_body_util::Full;
use hyper::{body::Incoming, header, Request, Response, StatusCode};
use prfs_axum_lib::io::{full, ApiHandlerResult, BytesBoxBody};
use prfs_common_server_state::ServerState;
use serde_json::Value;
use std::sync::Arc;

pub async fn handle_server_status(
    State(state): State<Arc<ServerState>>,
) -> (StatusCode, Json<Value>) {
    let json = serde_json::json!({
        "commit_hash": state.commit_hash.to_string(),
        "launch_time": state.launch_time.to_string(),
    });

    (StatusCode::OK, Json(json))
}
