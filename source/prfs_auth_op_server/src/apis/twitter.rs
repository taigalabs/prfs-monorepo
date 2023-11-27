use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{AuthenticateRequest, AuthenticateResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use routerify::prelude::*;
use std::{convert::Infallible, sync::Arc};

use crate::{
    responses::{ApiResponse, ResponseCode},
    server::{request::parse_req, state::ServerState},
};

pub async fn authenticate_twitter_account(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: AuthenticateRequest = parse_req(req).await;

    // let pool = &state.db2.pool;
    // let mut tx = pool.begin().await.unwrap();

    // let prfs_account = PrfsAccount {
    //     account_id: req.account_id.to_string(),
    //     avatar_color: req.avatar_color.to_string(),
    //     policy_ids: Json::from(vec![]),
    // };

    // let account_id = db_apis::insert_prfs_account(&mut tx, &prfs_account)
    //     .await
    //     .unwrap();

    // tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(AuthenticateResponse {
        // account_id: account_id.to_string(),
    });

    return Ok(resp.into_hyper_response());
}

// pub async fn sign_in_prfs_account(req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     let state = req.data::<Arc<ServerState>>().unwrap().clone();

//     let req: SignInRequest = parse_req(req).await;

//     let pool = &state.db2.pool;

//     let prfs_account = db_apis::get_prfs_account_by_account_id(pool, &req.account_id)
//         .await
//         .unwrap();

//     let resp = ApiResponse::new_success(SignInResponse { prfs_account });

//     return Ok(resp.into_hyper_response());
// }
