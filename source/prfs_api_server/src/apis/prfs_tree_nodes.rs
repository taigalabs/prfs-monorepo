use crate::state::ServerState;
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::models::PrfsTreeNode;
use routerify::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct NodePos {
    pub pos_w: Decimal,
    pub pos_h: i32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetNodesRequest<'a> {
    set_id: &'a str,
    pos: Vec<NodePos>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetNodesResponse {
    tree_nodes: Vec<PrfsTreeNode>,
}

pub async fn get_prfs_tree_nodes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("gen proof request");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let get_nodes_req = serde_json::from_str::<GetNodesRequest>(&body_str)
        .expect("get_nodes request should be parsable");

    println!("get_nodes_req: {:?}", get_nodes_req);

    let set_id = get_nodes_req.set_id.to_string();

    let whre: Vec<String> = get_nodes_req
        .pos
        .iter()
        .map(|mp| format!("(pos_w = {} and pos_h = {})", mp.pos_w, mp.pos_h))
        .collect();

    let whre = whre.join(" OR ");

    let where_clause = format!(
        "set_id = '{}' AND ({}) ORDER BY pos_h",
        set_id.to_string(),
        whre,
    );

    println!("where_clause, {}", where_clause);

    let tree_nodes = state
        .db
        .get_prfs_tree_nodes(&where_clause)
        .await
        .expect("get nodes fail");

    // println!("merkle_path: {:?}", merkle_path);

    let get_nodes_resp = GetNodesResponse { tree_nodes };

    let data = serde_json::to_string(&get_nodes_resp).unwrap();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
