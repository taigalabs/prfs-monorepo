use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use hyper::{body::Incoming, header, Response};
use prfs_axum_lib::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesBySetIdRequest,
    GetPrfsTreeNodesByPosRequest, GetPrfsTreeNodesResponse, UpdatePrfsTreeNodeRequest,
    UpdatePrfsTreeNodeResponse,
};
use std::sync::Arc;

pub async fn get_prfs_tree_nodes_by_pos(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeNodesByPosRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes = prfs::get_prfs_tree_nodes_by_pos(pool, &input.set_id, &input.pos)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeLeafNodesBySetIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes = prfs::get_prfs_tree_leaf_nodes_by_set_id(
        pool,
        &input.set_id,
        input.page_idx,
        input.page_size,
    )
    .await
    .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_tree_leaf_indices(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsTreeLeafIndicesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsTreeNodesResponse>>) {
    let pool = &state.db2.pool;
    let prfs_tree_nodes = prfs::get_prfs_tree_leaf_indices(pool, &input.set_id, &input.leaf_vals)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });
    return (StatusCode::OK, Json(resp));
}

pub async fn update_prfs_tree_node(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<UpdatePrfsTreeNodeRequest>,
) -> (StatusCode, Json<ApiResponse<UpdatePrfsTreeNodeResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();
    let pos_w = prfs::update_prfs_tree_node(&mut tx, &input.prfs_tree_node)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(UpdatePrfsTreeNodeResponse { pos_w });

    tx.commit().await.unwrap();

    return (StatusCode::OK, Json(resp));
}
