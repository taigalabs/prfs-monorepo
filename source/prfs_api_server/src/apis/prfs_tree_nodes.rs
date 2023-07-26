use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::models::PrfsTreeNode;
use routerify::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct NodePos {
    pub pos_w: Decimal,
    pub pos_h: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsTreeNodesRequest {
    set_id: String,
    pos: Vec<NodePos>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsTreeNodesResponse {
    prfs_tree_nodes: Vec<PrfsTreeNode>,
}

pub async fn get_prfs_tree_nodes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsTreeNodesRequest>(&body_str)
        .expect("get_nodes request should be parsable");

    println!("req {:?}", req);

    let set_id = req.set_id.to_string();

    let whre: Vec<String> = req
        .pos
        .iter()
        .map(|mp| format!("(pos_w = {} and pos_h = {})", mp.pos_w, mp.pos_h))
        .collect();

    let whre = whre.join(" OR ");

    let where_clause = format!(
        "where set_id = '{}' AND ({}) ORDER BY pos_h",
        set_id.to_string(),
        whre,
    );

    println!("where_clause, {}", where_clause);

    let prfs_tree_nodes = state
        .db
        .get_prfs_tree_nodes(&where_clause)
        .await
        .expect("get nodes fail");

    // println!("merkle_path: {:?}", merkle_path);

    let get_nodes_resp = GetPrfsTreeNodesResponse { prfs_tree_nodes };

    let data = serde_json::to_string(&get_nodes_resp).unwrap();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsTreeLeafNodesRequest {
    page: u32,
    limit: u32,
    set_id: String,
}

pub async fn get_prfs_tree_leaf_nodes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsTreeLeafNodesRequest>(&body_str).unwrap();

    println!("req {:?}", req);

    let set_id = req.set_id.to_string();

    let where_clause = format!(
        "where set_id = '{}' AND pos_h = 0 limit {}",
        set_id.to_string(),
        req.limit,
    );

    println!("where_clause, {}", where_clause);

    let prfs_tree_nodes = state
        .db
        .get_prfs_tree_nodes(&where_clause)
        .await
        .expect("get nodes fail");

    // println!("merkle_path: {:?}", merkle_path);

    let resp = ApiResponse::new_success(GetPrfsTreeNodesResponse { prfs_tree_nodes });

    return Ok(resp.into_hyper_response());
}
