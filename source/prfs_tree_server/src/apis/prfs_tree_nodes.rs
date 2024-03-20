use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesBySetIdRequest,
    GetPrfsTreeNodesByPosRequest, GetPrfsTreeNodesResponse, UpdatePrfsTreeNodeRequest,
    UpdatePrfsTreeNodeResponse,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use std::sync::Arc;

pub async fn get_prfs_tree_nodes_by_pos(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeNodesByPosRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes = match prfs::get_prfs_tree_nodes_by_pos(pool, &input.tree_id, &input.pos)
        .await
    {
        Ok(n) => n,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeLeafNodesBySetIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes = match prfs::get_prfs_tree_leaf_nodes_by_set_id(
        pool,
        &input.set_id,
        input.page_idx,
        input.page_size,
    )
    .await
    {
        Ok(n) => n,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_tree_leaf_indices(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeLeafIndicesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes =
        match prfs::get_prfs_tree_leaf_indices(pool, &input.set_id, &input.leaf_vals).await {
            Ok(n) => n,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                    err.to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn update_prfs_tree_node(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<UpdatePrfsTreeNodeRequest>,
) -> (StatusCode, Json<ApiResponse<UpdatePrfsTreeNodeResponse>>) {
    let pool = &state.db2.pool;

    let mut tx = bail_out_tx!(pool, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    let pos_w = prfs::update_prfs_tree_node(&mut tx, &input.prfs_tree_node)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(UpdatePrfsTreeNodeResponse { pos_w });

    bail_out_tx_commit!(tx, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    return (StatusCode::OK, Json(resp));
}
