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

pub enum RequestContext {
    Dev,
    Prod,
}

const TWITTER_OAUTH_TOKEN_URL: &str = "https://api.twitter.com/2/oauth2/token";
const TWITTER_OAUTH_CLIENT_ID_DEV: &str = "UU9OZ0hNOGVPelVtakgwMlVmeEw6MTpjaQ";
const TWITTER_OAUTH_CLIENT_ID_PROD: &str = "M2RKcktXTkE0N1RsUXVJMjFOY1U6MTpjaQ";
const TWITTER_GET_ME_URL: &str = "https://api.twitter.com/2/users/me";

#[derive(Serialize, Deserialize, Debug)]
pub struct TwitterOauthTokenParams {
    client_id: String,
    code_verifier: String,
    redirect_uri: String,
    grant_type: String,
    code: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TwitterOauthSuccessResponse {
    token_type: String,
    expires_in: i16,
    access_token: String,
    scope: String,
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
//
// export async function getTwitterUser(
//   accessToken: string,
// ): Promise<TwitterUser | null> {
//   try {
//     // request GET https://api.twitter.com/2/users/me
//     const res = await axios.get<{ data: TwitterUser }>(
//       "https://api.twitter.com/2/users/me",
//       {
//         headers: {
//           "Content-type": "application/json",
//           // put the access token in the Authorization Bearer token
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );

//     return res.data.data ?? null;
//   } catch (err) {
//     return null;
//   }
// }
//
pub async fn authenticate_twitter_account(
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
    request_context: RequestContext,
) -> Result<Response<BoxBody>, AuthOpServerError> {
    let q = req.uri().query().unwrap();
    let parse = url::form_urlencoded::parse(q.as_bytes());
    let query_map: HashMap<String, String> = parse.into_owned().collect();

    let code = query_map
        .get("code")
        .expect("twitter account auth needs 'code' value made by Twitter");

    println!("code: {}", code);

    let redirect_uri = match request_context {
        RequestContext::Dev => "http://localhost:4020/oauth/twitter/dev",
        RequestContext::Prod => "https://prfs.xyz/oauth/twitter",
    };

    let client_id = match request_context {
        RequestContext::Dev => TWITTER_OAUTH_CLIENT_ID_DEV,
        RequestContext::Prod => TWITTER_OAUTH_CLIENT_ID_PROD,
    };

    let front_end_redirect_uri = match request_context {
        RequestContext::Dev => "http://localhost:3000/auth/twitter",
        RequestContext::Prod => "https://prfs.xyz/auth/twitter",
    };

    let params = TwitterOauthTokenParams {
        client_id: client_id.to_string(),
        code_verifier: "challenge".to_string(),
        redirect_uri: redirect_uri.to_string(),
        grant_type: "authorization_code".to_string(),
        code: code.to_string(),
    };

    let data = serde_urlencoded::to_string(&params).expect("serialize issue");
    let twitter_oauth_req: Request<Full<Bytes>> = Request::builder()
        .method(Method::POST)
        .uri(TWITTER_OAUTH_TOKEN_URL)
        .header(header::CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(Full::from(data))
        .unwrap();

    println!("twitter_oauth_req: {:?}", twitter_oauth_req.body());

    let https = HttpsConnector::new();
    let client = Client::builder(TokioExecutor::new()).build::<_, Full<Bytes>>(https);

    let res = client.request(twitter_oauth_req).await.unwrap();
    let body = res.collect().await.unwrap().aggregate();
    let twitter_resp: serde_json::Value = serde_json::from_reader(body.reader()).unwrap();

    let twitter_resp: TwitterOauthSuccessResponse = if let Some(e) = twitter_resp.get("error") {
        println!(
            "Twitter Oauth response contains error, {}, resp: {:?}",
            e, twitter_resp
        );

        let resp = Response::builder()
            .header(
                header::LOCATION,
                format!("{}?error={}", front_end_redirect_uri, e),
            )
            .body(full(""))
            .unwrap();

        return Ok(resp);
    } else {
        serde_json::from_value(twitter_resp).unwrap()
    };

    println!("b: {:?}", twitter_resp);

    // let twitter_get_me_req: Request<Empty<Bytes>> = Request::builder()
    //     .method(Method::GET)
    //     .uri(TWITTER_GET_ME_URL)
    //     .header(header::CONTENT_TYPE, "application/json")
    //     .header(
    //         header::AUTHORIZATION,
    //         format!("Bearer {}", twitter_resp.access_token),
    //     )
    //     .body(Empty::<Bytes>::new())
    //     .unwrap();

    // let https = HttpsConnector::new();
    // let client = Client::builder(TokioExecutor::new()).build::<_, Empty<Bytes>>(https);
    // let res = client.request(twitter_get_me_req).await.unwrap();
    // let body = res.collect().await.unwrap().to_bytes();

    // println!("11: {:?}", body);

    let resp = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(""))
        .unwrap();

    Ok(resp)
}
