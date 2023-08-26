use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        GetPrfsTreeLeafIndicesRequest, GetPrfsTreeLeafNodesRequest, GetPrfsTreeNodesByPosRequest,
        GetPrfsTreeNodesResponse,
    },
    entities::PrfsTreeNode,
};
use routerify::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

use crate::{responses::ApiResponse, state::ServerState};

pub async fn get_prfs_tree_nodes_by_pos(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsTreeNodesByPosRequest>(&body_str)
        .expect("get_nodes request should be parsable");

    println!("req {:?}", req);

    let prfs_tree_nodes = db_apis::get_prfs_tree_nodes_by_pos(pool, &req.set_id, &req.pos)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    Ok(resp.into_hyper_response())
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsTreeLeafNodesRequest>(&body_str).unwrap();

    println!("req {:?}", req);

    let prfs_tree_nodes =
        db_apis::get_prfs_tree_leaf_nodes_by_set_id(pool, &req.set_id, req.page_idx, req.page_size)
            .await
            .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_tree_leaf_indices(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsTreeLeafIndicesRequest>(&body_str).unwrap();

    println!("req {:?}", req);

    let prfs_tree_nodes = db_apis::get_prfs_tree_leaf_indices(pool, &req.set_id, &req.leaf_vals)
        .await
        .expect("get nodes fail");

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    return Ok(resp.into_hyper_response());
}
