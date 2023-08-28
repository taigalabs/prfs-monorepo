use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsSetRequest, GetPrfsSetBySetIdRequest, GetPrfsSetBySetIdResponse,
    GetPrfsSetsBySetTypeRequest, GetPrfsSetsRequest, GetPrfsSetsResponse,
    GetPrfsTreeLeafNodesRequest,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
    ApiServerError,
};

pub async fn get_prfs_sets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_sets = db_apis::get_prfs_sets(pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: req.page_idx,
        page_size: req.page_size,
        prfs_sets,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_sets_by_set_type(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetsBySetTypeRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_sets =
        db_apis::get_prfs_sets_by_set_type(pool, req.set_type, req.page_idx, req.page_size)
            .await
            .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: req.page_idx,
        page_size: req.page_size,
        prfs_sets,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_set_by_set_id(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetBySetIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_set = db_apis::get_prfs_set_by_set_id(pool, &req.set_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetBySetIdResponse { prfs_set });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_set(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: CreatePrfsSetRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_sets = db_apis::insert_prfs_set(pool).await.unwrap();
    // insert_prfs_set()

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: req.page_idx,
        page_size: req.page_size,
        prfs_sets,
    });

    return Ok(resp.into_hyper_response());
}
