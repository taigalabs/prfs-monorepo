use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_circuits_circom::CircuitBuildJson;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitsRequest {
    page: u32,
    circuit_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitsRespPayload {
    page: usize,
    prfs_circuits: Vec<CircuitBuildJson>,
}

pub async fn get_prfs_native_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get circuits");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitsRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    unimplemented!();
    // let mut circuits = vec![];
    // if let Some(circuit_id) = req.circuit_id {
    //     for (_, circuit_build) in &state.local_assets.build_json {
    //         if circuit_id == circuit_build.circuit_id {
    //             circuits.push(circuit_build.clone());
    //         }
    //     }
    // } else {
    //     for (_, circuit_build) in &state.local_assets.build_json.circuit_builds {
    //         circuits.push(circuit_build.clone());
    //     }
    // }

    // let resp = ApiResponse::new_success(GetCircuitsRespPayload {
    //     page: 0,
    //     prfs_circuits: circuits,
    // });

    // return Ok(resp.into_hyper_response());
}
