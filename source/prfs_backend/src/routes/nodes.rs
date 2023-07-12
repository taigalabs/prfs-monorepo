use crate::State;
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::models::Node;
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
struct GetNodesRequest<'a> {
    set_id: &'a str,
    pos: Vec<NodePos>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetNodesResponse {
    nodes: Vec<Node>,
}

pub async fn get_nodes(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("gen proof request");

    let state = req.data::<State>().unwrap();
    let db = state.db.clone();

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

    let rows = db.get_nodes(&where_clause).await.expect("get nodes fail");

    let nodes: Vec<Node> = get_nodes_req
        .pos
        .iter()
        .enumerate()
        .map(|(idx, mp)| match rows.get(idx) {
            Some(r) => {
                let pos_w: Decimal = r.try_get("pos_w").unwrap();
                let pos_h: i32 = r.try_get("pos_h").unwrap();
                let val: String = r.try_get("val").unwrap();
                let set_id: String = r.try_get("set_id").unwrap();

                Node {
                    pos_w,
                    pos_h,
                    val,
                    set_id,
                }
            }
            None => Node {
                pos_w: mp.pos_w,
                pos_h: mp.pos_h,
                val: "0x0000000000000000000000000000000000000000000000000000000000000000"
                    .to_string(),
                set_id: set_id.to_string(),
            },
        })
        .collect();

    // println!("merkle_path: {:?}", merkle_path);

    let get_nodes_resp = GetNodesResponse { nodes };

    let data = serde_json::to_string(&get_nodes_resp).unwrap();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
