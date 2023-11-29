use hyper::{body, Request, Response};
use hyper_util::rt::TokioIo;
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{AuthenticateRequest, AuthenticateResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use routerify::prelude::*;
use std::{collections::HashMap, convert::Infallible, sync::Arc};
use tokio::net::TcpStream;

use crate::{
    responses::{ApiResponse, ResponseCode},
    server::{io::BoxBody, state::ServerState},
    AuthOpServerError,
};

const TWITTER_OAUTH_TOKEN_URL: &str = "https://api.twitter.com/2/oauth2/token";

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
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BoxBody>, AuthOpServerError> {
    let q = req.uri().query().unwrap();
    let parse = url::form_urlencoded::parse(q.as_bytes());
    let query_map: HashMap<String, String> = parse.into_owned().collect();

    let code = query_map
        .get("code")
        .expect("twitter account auth needs 'code' value made by Twitter");

    let url = TWITTER_OAUTH_TOKEN_URL.parse::<hyper::Uri>().unwrap();

    // let handle = tokio::task::spawn(async move {
    //     println!("11111");
    //     // Get the host and the port
    //     let host = url.host().expect("uri has no host");
    //     let port = url.port_u16().unwrap_or(80);

    //     let address = format!("{}:{}", host, port);

    //     // Open a TCP connection to the remote host
    //     let stream = TcpStream::connect(address).await.unwrap();
    //     let io = TokioIo::new(stream);

    //     // Perform a TCP handshake
    //     let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await.unwrap();

    //     // if let Err(err) = conn.await {
    //     //     println!("Connection failed: {:?}", err);
    //     // }
    // })
    // .await;

    // let resp = ApiResponse::new_success(AuthenticateResponse {});

    // return Ok(resp.into_hyper_response());
    //
    panic!();
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
