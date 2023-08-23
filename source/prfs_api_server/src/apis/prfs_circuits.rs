use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_circuit_circom::CircuitBuildJson;
use prfs_entities::syn_entities::PrfsCircuitSyn1;
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
    prfs_circuits_syn1: Vec<PrfsCircuitSyn1>,
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

    let mut syn_circuits = vec![];
    if let Some(circuit_id) = req.circuit_id {
        match state.local_assets.syn_circuits.get(&circuit_id) {
            Some(c) => {
                syn_circuits.push(c.clone());
            }
            None => {}
        };
    } else {
        for (_, circuit) in &state.local_assets.syn_circuits {
            syn_circuits.push(circuit.clone());
        }
    }

    let resp = ApiResponse::new_success(GetCircuitsRespPayload {
        page: 0,
        prfs_circuits_syn1: syn_circuits,
    });

    return Ok(resp.into_hyper_response());
}
