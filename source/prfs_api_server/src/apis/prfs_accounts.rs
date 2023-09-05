use crate::{
    responses::{ApiResponse, ResponseCode},
    server::{request::parse_req, state::ServerState},
};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{SignInRequest, SignInResponse, SignUpRequest, SignUpResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

pub async fn sign_up_prfs_account(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: SignUpRequest = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_account = PrfsAccount {
        sig: req.sig.to_string(),
        avatar_color: req.avatarColor.to_string(),
        policy_ids: Json::from(vec![]),
    };

    let sig = db_apis::insert_prfs_account(&mut tx, &prfs_account)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(SignUpResponse {
        sig: sig.to_string(),
        id: sig[..10].to_string(),
    });

    return Ok(resp.into_hyper_response());
}

pub async fn sign_in_prfs_account(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: SignInRequest = parse_req(req).await;

    let pool = &state.db2.pool;

    let prfs_account = db_apis::get_prfs_account_by_sig(pool, &req.sig)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(SignInResponse { prfs_account });

    return Ok(resp.into_hyper_response());
}
