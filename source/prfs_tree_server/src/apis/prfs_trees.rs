use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    CreatePrfsTreeByPrfsSetRequest, CreatePrfsTreeByPrfsSetResponse,
    GetLatestPrfsTreeBySetIdRequest, GetLatestPrfsTreeBySetIdResponse, PrfsAtstTypeId,
    UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeByNewAtstResponse,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use std::sync::Arc;

use crate::ops::_create_prfs_tree_by_prfs_set;

pub async fn create_prfs_tree_by_prfs_set(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsTreeByPrfsSetRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<CreatePrfsTreeByPrfsSetResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    if let Err(err) =
        _create_prfs_tree_by_prfs_set(&mut tx, &input.set_id, &input.tree_label, &input.tree_id)
            .await
    {
        let resp =
            ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    bail_out_tx_commit!(tx, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsTreeByPrfsSetResponse {
        tree_id: input.tree_id.to_string(),
        set_id: input.set_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_latest_prfs_tree_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetLatestPrfsTreeBySetIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetLatestPrfsTreeBySetIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_tree = match prfs::get_latest_prfs_tree_by_set_id(pool, &input.set_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetLatestPrfsTreeBySetIdResponse { prfs_tree });
    return (StatusCode::OK, Json(resp));
}

pub async fn update_prfs_tree_by_new_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<UpdatePrfsTreeByNewAtstRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<UpdatePrfsTreeByNewAtstResponse>>,
) {
    state
        .tree_server_task_queue
        .add_task(&input.atst_type_id)
        .await;

    let resp = ApiResponse::new_success(UpdatePrfsTreeByNewAtstResponse {
        atst_type_id: input.atst_type_id,
    });
    return (StatusCode::OK, Json(resp));
}
