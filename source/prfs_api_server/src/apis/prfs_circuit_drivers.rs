use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_driver_type::CircuitDriver;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitDriversRequest {
    page: u32,
    driver_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitDriversRespPayload {
    page: usize,
    prfs_circuit_drivers: Vec<CircuitDriver>,
}

pub async fn get_prfs_native_circuit_drivers(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitDriversRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    let mut drivers = vec![];
    if let Some(driver_id) = req.driver_id {
        match state.local_assets.drivers.get(&driver_id) {
            Some(pgm) => drivers.push(pgm.clone()),
            None => {}
        };
    } else {
        for (_, driver) in &state.local_assets.drivers {
            drivers.push(driver.clone());
        }
    }

    let resp = ApiResponse::new_success(GetCircuitDriversRespPayload {
        page: 0,
        prfs_circuit_drivers: drivers,
    });

    return Ok(resp.into_hyper_response());
}
