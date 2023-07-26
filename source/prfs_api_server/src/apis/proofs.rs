use crate::state::ServerState;
use hyper::{body, header, Body, Request, Response};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetProofTypesRequest {
    addr: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetProofTypeResponse {
    proof_types: Vec<ProofType>,
}

#[derive(Serialize, Deserialize, Debug)]
struct ProofType {
    label: String,
    desc: String,
}

pub async fn get_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get proof types");

    // let state = req.data::<ServerState>().unwrap();
    // let db = state.db.clone();

    // let bytes = body::to_bytes(req.into_body()).await.unwrap();
    // let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    // let get_proof_types_req = serde_json::from_str::<GetProofTypesRequest>(&body_str).unwrap();

    // println!("get_proof_types_req: {:?}", get_proof_types_req);

    // let rows = db.get_proof_types().await.expect("get nodes fail");
    // println!("rows: {:?}", rows);

    // let proof_types: Vec<ProofType> = rows
    //     .iter()
    //     .map(|r| {
    //         let desc: String = r.try_get("desc").unwrap();
    //         let label: String = r.try_get("label").unwrap();

    //         ProofType { desc, label }
    //     })
    //     .collect();

    // println!("proof_types: {:?}", proof_types);

    // let resp = GetProofTypeResponse { proof_types };

    // let data = serde_json::to_string(&resp).unwrap();

    // let res = Response::builder()
    //     .header(header::CONTENT_TYPE, "application/json")
    //     .body(Body::from(data))
    //     .unwrap();

    // Ok(res)

    unimplemented!()
}
