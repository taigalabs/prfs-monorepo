use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_entities::entities::{CircuitType, PrfsCircuitDriver};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitTypesRequest {
    page: u32,
    circuit_type_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitTypesRespPayload {
    page: usize,
    prfs_circuit_types: Vec<CircuitType>,
}

pub async fn get_prfs_native_circuit_types(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitTypesRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    unimplemented!();

    // let mut prfs_circuit_types = vec![];
    // if let Some(circuit_type_id) = req.circuit_type_id {
    //     match state.local_assets.circuit_types.get(&circuit_type_id) {
    //         Some(circuit_type) => prfs_circuit_types.push(circuit_type.clone()),
    //         None => {}
    //     };
    // } else {
    //     for (_, driver) in &state.local_assets.circuit_types {
    //         prfs_circuit_types.push(driver.clone());
    //     }
    // }

    // let resp = ApiResponse::new_success(GetCircuitTypesRespPayload {
    //     page: 0,
    //     prfs_circuit_types,
    // });

    // return Ok(resp.into_hyper_response());
}
