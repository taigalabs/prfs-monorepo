use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesRequest, GetPrfsTreeNodesByPosRequest,
    GetPrfsTreeNodesResponse, UpdatePrfsTreeNodeRequest, UpdatePrfsTreeNodeResponse,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
};

pub async fn get_prfs_tree_nodes_by_pos(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsTreeNodesByPosRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_tree_nodes = db_apis::get_prfs_tree_nodes_by_pos(pool, &req.set_id, &req.pos)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    Ok(resp.into_hyper_response())
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsTreeLeafNodesRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_tree_nodes =
        db_apis::get_prfs_tree_leaf_nodes_by_set_id(pool, &req.set_id, req.page_idx, req.page_size)
            .await
            .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_tree_leaf_indices(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsTreeLeafIndicesRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_tree_nodes = db_apis::get_prfs_tree_leaf_indices(pool, &req.set_id, &req.leaf_vals)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    return Ok(resp.into_hyper_response());
}

pub async fn update_prfs_tree_node(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: UpdatePrfsTreeNodeRequest = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let pos_w = db_apis::update_prfs_tree_node(&mut tx, &req.prfs_tree_node)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(UpdatePrfsTreeNodeResponse { pos_w });

    tx.commit().await.unwrap();

    return Ok(resp.into_hyper_response());
}
