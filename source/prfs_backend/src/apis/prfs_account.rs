use crate::{state::ServerState, BackendError};
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::models::EthTreeNode;
use routerify::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct NodePos {
    pub pos_w: Decimal,
    pub pos_h: i32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignUpRequest {
    sig: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetNodesResponse {
    nodes: Vec<EthTreeNode>,
}

pub async fn sign_up(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("sign up prfs");

    let state = req.data::<ServerState>().unwrap();
    let db = state.db.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let sign_up_req = serde_json::from_str::<SignUpRequest>(&body_str)
        .expect("sign_up_req request should be parsable");

    println!("sign_up_req: {:?}", sign_up_req);

    // let whre: Vec<String> = sign_up_req
    //     .pos
    //     .iter()
    //     .map(|mp| format!("(pos_w = {} and pos_h = {})", mp.pos_w, mp.pos_h))
    //     .collect();

    // let whre = whre.join(" OR ");

    // let where_clause = format!(
    //     "set_id = '{}' AND ({}) ORDER BY pos_h",
    //     set_id.to_string(),
    //     whre,
    // );

    // println!("where_clause, {}", where_clause);

    // let nodes = db
    //     .get_eth_tree_nodes(&where_clause)
    //     .await
    //     .expect("get nodes fail");

    // // println!("merkle_path: {:?}", merkle_path);

    // let get_nodes_resp = GetNodesResponse { nodes };

    // let data = serde_json::to_string(&get_nodes_resp).unwrap();

    let data = "".to_string();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
