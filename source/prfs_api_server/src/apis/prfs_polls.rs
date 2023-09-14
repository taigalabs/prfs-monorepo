use ethers_signers::Signer;
use hyper::{Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsPoll, CreatePrfsProofInstanceRequest, CreatePrfsProofInstanceResponse,
    GetPrfsProofInstanceByInstanceIdRequest, GetPrfsProofInstanceByInstanceIdResponse,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstanceByShortIdResponse,
    GetPrfsProofInstancesRequest, GetPrfsProofInstancesResponse,
};
use prfs_entities::entities::{PrfsPoll, PrfsProofInstance};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

use crate::responses::ApiResponse;
use crate::server::request::parse_req;
use crate::server::state::ServerState;

pub async fn create_poll(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: CreatePrfsPoll = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    // let prfs_poll = PrfsPoll {};

    db_apis::insert_prfs_poll(&mut tx).await;

    let resp = ApiResponse::new_success(GetPrfsProofInstancesResponse {
        page_idx: req.page_idx,
        table_row_count,
        prfs_proof_instances_syn1,
    });

    return Ok(resp.into_hyper_response());
}
