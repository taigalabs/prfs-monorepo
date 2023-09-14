use ethers_signers::Signer;
use hyper::{Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsPollRequest, CreatePrfsPollResponse, GetPrfsPollByPollIdRequest,
    GetPrfsPollByPollIdResponse, GetPrfsPollsRequest, GetPrfsPollsResponse,
};
use prfs_entities::entities::{PrfsPoll, PrfsProofInstance};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

use crate::responses::ApiResponse;
use crate::server::request::parse_req;
use crate::server::state::ServerState;

pub async fn get_prfs_polls(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsPollsRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_polls = db_apis::get_prfs_polls(&pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollsResponse {
        page_idx: req.page_idx,
        prfs_polls,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_poll_by_poll_id(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: GetPrfsPollByPollIdRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_poll = db_apis::get_prfs_poll_by_poll_id(&pool, &req.poll_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsPollByPollIdResponse { prfs_poll });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_poll(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: CreatePrfsPollRequest = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let poll_id = db_apis::insert_prfs_poll(&mut tx, &req).await.unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsPollResponse { poll_id });

    return Ok(resp.into_hyper_response());
}
