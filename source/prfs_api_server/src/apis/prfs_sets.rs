use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    GetPrfsSetBySetIdRequest, GetPrfsSetBySetIdResponse, GetPrfsSetsRequest, GetPrfsSetsResponse,
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

// pub async fn get_prfs_set_elements(req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     let state = req.data::<Arc<ServerState>>().unwrap();
//     let state = state.clone();

//     let pool = &state.db2.pool;

//     let bytes = body::to_bytes(req.into_body()).await.unwrap();
//     let body_str = String::from_utf8(bytes.to_vec()).unwrap();
//     let req = serde_json::from_str::<GetPrfsTreeLeafNodesRequest>(&body_str)
//         .expect("req request should be parsable");

//     let prfs_set = db_apis::get_prfs_set_by_set_id(pool, &req.set_id)
//         .await
//         .unwrap();

//     let resp = ApiResponse::new_success(GetPrfsSetBySetIdResponse { prfs_set });

//     return Ok(resp.into_hyper_response());
// }
