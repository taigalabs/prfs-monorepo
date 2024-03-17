use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeByNewAtstResponse};
use std::sync::Arc;

pub async fn update_prfs_tree_by_new_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<UpdatePrfsTreeByNewAtstRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<UpdatePrfsTreeByNewAtstResponse>>,
) {
    let pool = &state.clone().db2.pool;

    let _ = prfs::get_prfs_sets_by_topic(input.atst_type).await;
    let prfs_circuit_drivers = prfs::get_prfs_circuit_drivers(&pool).await;

    let resp = ApiResponse::new_success(UpdatePrfsTreeByNewAtstResponse {
        prfs_set_ids: vec![],
    });
    return (StatusCode::OK, Json(resp));
}
