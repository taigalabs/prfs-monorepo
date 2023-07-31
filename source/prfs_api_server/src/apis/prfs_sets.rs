use crate::{responses::ApiResponse, state::ServerState, ApiServerError};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::models::PrfsSet;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

#[derive(Serialize, Deserialize, Debug)]
struct GetSetsRequest {
    page: usize,
    set_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct GetSetsRespPayload {
    page: usize,
    prfs_sets: Vec<PrfsSet>,
}

pub async fn get_prfs_sets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req =
        serde_json::from_str::<GetSetsRequest>(&body_str).expect("req request should be parsable");

    let mut where_clause = String::new();

    if let Some(set_id) = req.set_id {
        where_clause = format!("where set_id='{}'", &set_id);
    }

    let prfs_sets = state.db.get_prfs_sets(&where_clause).await.unwrap();

    let resp = ApiResponse::new_success(GetSetsRespPayload { page: 0, prfs_sets });

    return Ok(resp.into_hyper_response());
}
