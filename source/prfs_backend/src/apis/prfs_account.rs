use crate::{
    apis::prfs_account,
    responses::{ApiErrorResponse, ResponseCode},
    state::ServerState,
    BackendError,
};
use hyper::{body, header, Body, Request, Response, StatusCode};
use prfs_db_interface::models::{EthTreeNode, PrfsAccount};
use routerify::prelude::*;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct SignUpRequest {
    sig: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct SignUpResponse {
    code: ResponseCode,
    status: String,
}

pub async fn sign_up(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("sign up prfs");

    let state = req.data::<ServerState>().unwrap();
    let db = state.db.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let sign_up_req = serde_json::from_str::<SignUpRequest>(&body_str)
        .expect("sign_up_req request should be parsable");

    println!("sign_up_req: {:?}", sign_up_req);

    let where_clause = format!("sig = '{}'", sign_up_req.sig);

    let prfs_accounts = db.get_prfs_account(&where_clause).await.unwrap();

    if prfs_accounts.len() > 0 {
        println!("prfs_accounts: {:?}", prfs_accounts);

        let resp = ApiErrorResponse {
            code: ResponseCode::ERROR,
            error: format!("Accout already exists, sig: {}", sign_up_req.sig),
        };

        let data = serde_json::to_vec(&resp).unwrap();

        let res = Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(Body::from(data))
            .unwrap();

        return Ok(res);
    }

    let prfs_account = PrfsAccount {
        sig: sign_up_req.sig.to_string(),
    };

    db.insert_prfs_account(prfs_account).await.unwrap();

    let res = SignUpResponse {
        code: ResponseCode::SUCCESS,
        status: String::from("ok"),
    };

    let data = serde_json::to_vec(&res).unwrap();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
