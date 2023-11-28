use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{AuthenticateRequest, AuthenticateResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use routerify::prelude::*;
use std::{collections::HashMap, convert::Infallible, sync::Arc};

use crate::{
    responses::{ApiResponse, ResponseCode},
    server::{request::parse_req, state::ServerState},
};

// try {
//   // POST request to the token url to get the access token
//   //
//   const data = { ...twitterOauthTokenParams, code };
//   console.log("getTwitterOAuthToken: %o", data);

//   const res = await axios.post<TwitterTokenResponse>(
//     TWITTER_OAUTH_TOKEN_URL,
//     new URLSearchParams(data).toString(),
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         // Authorization: `Basic ${BasicAuthToken}`,
//       },
//     },
//   );

//   return res.data;
// } catch (err) {
//   return null;
// }
pub async fn authenticate_twitter_account(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let q = req.uri().query().unwrap();
    let parse = url::form_urlencoded::parse(q.as_bytes());
    let query_map: HashMap<String, String> = parse.into_owned().collect();

    let code = query_map
        .get("code")
        .expect("twitter account auth needs 'code' value made by Twitter");

    let resp = ApiResponse::new_success(AuthenticateResponse {});

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
