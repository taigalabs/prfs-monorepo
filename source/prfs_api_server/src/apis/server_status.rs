use prfs_axum_lib::axum::http::StatusCode;
use prfs_axum_lib::axum::{extract::State, Json};
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
