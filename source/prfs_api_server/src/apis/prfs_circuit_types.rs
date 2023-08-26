use crate::{responses::ApiResponse, state::ServerState};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{GetCircuitTypesRequest, GetCircuitTypesResponse},
    entities::{PrfsCircuitDriver, PrfsCircuitType},
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_native_circuit_types(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetCircuitTypesRequest>(&body_str)
        .expect("req request should be parsable");

    println!("req: {:?}", req);

    let prfs_circuit_types = if let Some(circuit_type) = req.circuit_type {
        db_apis::get_prfs_circuit_types_by_circuit_type(&pool, &circuit_type).await
    } else {
        db_apis::get_prfs_circuit_types(&pool).await
    };

    let resp = ApiResponse::new_success(GetCircuitTypesResponse {
        page: 0,
        prfs_circuit_types,
    });

    return Ok(resp.into_hyper_response());
}
