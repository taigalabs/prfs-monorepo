use http_body_util::{BodyExt, Empty, Full};
use hyper::{
    body::{self, Buf, Bytes},
    header, Method, Request, Response,
};
use hyper_tls::HttpsConnector;
use hyper_util::{
    client::legacy::Client,
    rt::{TokioExecutor, TokioIo},
};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{AuthenticateRequest, AuthenticateResponse},
    entities::PrfsAccount,
    sqlx::types::Json,
};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, convert::Infallible, io::Write, sync::Arc};
use tokio::net::TcpStream;

use crate::{
    responses::{ApiResponse, ResponseCode},
    server::{
        io::{full, BoxBody},
        state::ServerState,
    },
    AuthOpServerError,
};

const TWITTER_OAUTH_TOKEN_URL: &str = "https://api.twitter.com/2/oauth2/token";
const TWITTER_OAUTH_CLIENT_ID: &str = "UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ";

#[derive(Serialize, Deserialize, Debug)]
pub struct TwitterOauthTokenParams {
    client_id: String,
    code_verifier: String,
    redirect_uri: String,
    grant_type: String,
    code: String,
}

// filling up the query parameters needed to request for getting the token
// export const twitterOauthTokenParams = {
//   client_id: TWITTER_OAUTH_CLIENT_ID,
//   code_verifier: "challenge",
//   redirect_uri: `http://127.0.0.1:4020/oauth/twitter`,
//   grant_type: "authorization_code",
// };

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

    println!("code: {}", code);

    let params = TwitterOauthTokenParams {
        client_id: TWITTER_OAUTH_CLIENT_ID.to_string(),
        code_verifier: "challenge".to_string(),
        redirect_uri: "http://127.0.0.1:4020/oauth/twitter".to_string(),
        grant_type: "authorization_code".to_string(),
        code: code.to_string(),
    };

    // let params = serde_json::to_vec(&params).unwrap();
    let data = serde_urlencoded::to_string(&params).expect("serialize issue");

    let req: Request<Full<Bytes>> = Request::builder()
        .method(Method::POST)
        .uri(TWITTER_OAUTH_TOKEN_URL)
        .header(header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(Full::from(data))
        .unwrap();

    println!("req: {:?}", req.body());

    let https = HttpsConnector::new();
    let client = Client::builder(TokioExecutor::new()).build::<_, Full<Bytes>>(https);
    let res = client.request(req).await?;

    println!("123123");

    let body = res.collect().await?.to_bytes();

    println!("body: {:?}", body);

    let resp = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(""))
        .unwrap();

    Ok(resp)
}
