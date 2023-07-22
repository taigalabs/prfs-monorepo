use crate::{
    apis::prfs_account,
    responses::{ApiResponse, ResponseCode},
    state::ServerState,
    ApiServerError,
};
use hyper::{body, header, Body, Request, Response, StatusCode};
use prfs_db_interface::models::PrfsAccount;
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetCircuitsRequest {}

#[derive(Serialize, Deserialize, Debug)]
struct GetCircuitsRespPayload {}

pub async fn get_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get circuits");

    let state = req.data::<ServerState>().unwrap();
    let db = state.db.clone();

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let get_circuits_req = serde_json::from_str::<GetCircuitsRequest>(&body_str)
        .expect("req request should be parsable");

    // let where_clause = format!("sig = '{}'", sign_up_req.sig);

    // let prfs_accounts = db.get_prfs_account(&where_clause).await.unwrap();

    // println!("prfs_accounts: {:?}", prfs_accounts);

    // if prfs_accounts.len() > 0 {
    //     let resp =
    //         ApiResponse::new_error(format!("Accout already exists, sig: {}", sign_up_req.sig));

    //     return Ok(resp.into_hyper_response());
    // }

    // let prfs_account = PrfsAccount {
    //     sig: sign_up_req.sig.to_string(),
    // };

    // db.insert_prfs_account(&prfs_account).await.unwrap();

    // let resp = ApiResponse::new_success(SignUpRespPayload {
    //     sig: prfs_account.sig.to_string(),
    //     id: prfs_account.sig[..10].to_string(),
    // });
    panic!();

    // return Ok(resp.into_hyper_response());
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetNativeCircuitsRequest {}

#[derive(Serialize, Deserialize, Debug)]
struct GetNativeCircuitsRespPayload {}

pub async fn get_native_circuits(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("get circuits");

    let state = req.data::<ServerState>().unwrap();
    &state.build_json;

    let bytes = body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8(bytes.to_vec()).unwrap();
    let _get_circuits_req = serde_json::from_str::<GetCircuitsRequest>(&body_str)
        .expect("req request should be parsable");

    let payload = GetNativeCircuitsRespPayload {};

    let resp = ApiResponse::new_success(payload);

    return Ok(resp.into_hyper_response());
}
