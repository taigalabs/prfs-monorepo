use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsSet;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetSetsRequest {
    page: usize,
    set_id: Option<uuid::Uuid>,
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
    // let mut tx = pool.begin().await.unwrap();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req =
        serde_json::from_str::<GetSetsRequest>(&body_str).expect("req request should be parsable");

    if let Some(set_id) = req.set_id {
        let prfs_set = db_apis::get_prfs_set(pool, &set_id).await.unwrap();
        // let merkle_root = state.db2.get_prfs_tree_root(&set_id).await.unwrap();

        let resp = ApiResponse::new_success(GetSetsRespPayload {
            page: 0,
            prfs_sets: vec![prfs_set],
        });

        return Ok(resp.into_hyper_response());
    }

    let prfs_sets = db_apis::get_prfs_sets(pool).await.unwrap();

    let resp = ApiResponse::new_success(GetSetsRespPayload { page: 0, prfs_sets });

    return Ok(resp.into_hyper_response());
}
