use crate::{
    responses::{ApiResponse, ResponseCode},
    state::ServerState,
};
use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{SignUpRequest, SignUpResponse},
    entities::PrfsAccount,
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{convert::Infallible, sync::Arc};

pub async fn sign_up_prfs_account(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("sign up prfs");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<SignUpRequest>(&body_str)
        .expect("sign_up_req request should be parsable");

    println!("req: {:?}", req);

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_accounts = db_apis::get_prfs_accounts(pool, &req.sig).await.unwrap();

    if prfs_accounts.len() > 0 {
        let resp = ApiResponse::new_error(format!("Accout already exists, sig: {}", req.sig));

        return Ok(resp.into_hyper_response());
    }

    let prfs_account = PrfsAccount {
        sig: req.sig.to_string(),
        avatar_color: req.avatarColor.to_string(),
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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignInRequest {
    sig: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct SignInRespPayload {
    prfs_account: PrfsAccount,
}

pub async fn sign_in_prfs_account(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("sign in prfs");

    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let req = serde_json::from_str::<SignInRequest>(&body_str)
        .expect("sign_in_req request should be parsable");

    println!("req: {:?}", req);

    let pool = &state.db2.pool;

    let prfs_accounts = db_apis::get_prfs_accounts(pool, &req.sig).await.unwrap();

    if prfs_accounts.len() == 0 {
        println!("prfs_accounts: {:?}", prfs_accounts);

        let resp = ApiResponse::new_error(format!("No account has been found, sig: {}", req.sig));
        return Ok(resp.into_hyper_response());
    }

    let prfs_account = prfs_accounts.get(0).unwrap().clone();

    let resp = ApiResponse::new_success(SignInRespPayload { prfs_account });

    return Ok(resp.into_hyper_response());
}
