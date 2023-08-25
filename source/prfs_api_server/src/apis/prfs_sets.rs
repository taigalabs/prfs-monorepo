use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsSet;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsSetsRequest {
    page_idx: i32,
    page_size: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetSetsRespPayload {
    page: usize,
    prfs_sets: Vec<PrfsSet>,
}

pub async fn get_prfs_sets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsSetsRequest>(&body_str)
        .expect("req request should be parsable");

    let prfs_sets = db_apis::get_prfs_sets(pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetSetsRespPayload { page: 0, prfs_sets });

    return Ok(resp.into_hyper_response());
}

#[derive(Serialize, Deserialize, Debug)]
struct GetPrfsSetBySetIdRequest {
    set_id: Uuid,
}

pub async fn get_prfs_set_by_set_id(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let pool = &state.db2.pool;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<GetPrfsSetBySetIdRequest>(&body_str)
        .expect("req request should be parsable");

    let prfs_set = db_apis::get_prfs_set_by_set_id(pool, &req.set_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetSetsRespPayload {
        page: 0,
        prfs_sets: vec![prfs_set],
    });

    return Ok(resp.into_hyper_response());
}
