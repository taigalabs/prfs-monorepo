use crate::{
    apis::prfs_account,
    responses::{ApiResponse, ResponseCode},
    state::ServerState,
    ApiServerError,
};
use hyper::{body, header, Body, Request, Response, StatusCode};
use prfs_circuits_circom::CircuitBuildDetail;
use prfs_db_interface::models::PrfsAccount;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetCircuitsRequest {}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitsRespPayload {
    circuits: Vec<CircuitBuildDetail>,
    // "name": "addr_membership2",
    // "author": "SYSTEM_NATIVE",
    // "instance_path": "addr_membership2/instances/addr_membership2.circom",
    // "num_public_inputs": 5,
    // "wtns_gen_path": "addr_membership2/addr_membership2_js/addr_membership2.wasm",
    // "spartan_circuit_path": "addr_membership2/addr_membership2_1690074626890.spartan.circuit"
}

pub async fn get_native_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get circuits");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let _get_circuits_req = serde_json::from_str::<GetCircuitsRequest>(&body_str)
        .expect("req request should be parsable");

    let mut circuits = vec![];
    for (_, circuit_build) in &state.build_json.circuit_builds {
        circuits.push(circuit_build.clone());
    }

    let resp = ApiResponse::new_success(GetCircuitsRespPayload { circuits });

    return Ok(resp.into_hyper_response());
}
