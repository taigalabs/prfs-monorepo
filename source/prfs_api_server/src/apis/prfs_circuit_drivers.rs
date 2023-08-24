use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsCircuitDriver;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitDriversRequest {
    page: u32,
    circuit_driver_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitDriversRespPayload {
    page: usize,
    prfs_circuit_drivers: Vec<PrfsCircuitDriver>,
}

pub async fn get_prfs_native_circuit_drivers(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitDriversRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    let prfs_circuit_drivers = if let Some(circuit_driver_id) = req.circuit_driver_id {
        db_apis::get_prfs_circuit_driver_by_circuit_driver_id(&pool, &circuit_driver_id).await
    } else {
        db_apis::get_prfs_circuit_drivers(&pool).await
    };

    let resp = ApiResponse::new_success(GetCircuitDriversRespPayload {
        page: 0,
        prfs_circuit_drivers,
    });

    return Ok(resp.into_hyper_response());
}
