use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use routerify::prelude::RequestExt;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;
use tokio::net::TcpStream;

use super::io::{full, BoxBody};
use super::state::ServerState;
use crate::apis::cors::cors;
use crate::AuthOpServerError;

const PREFIX: &str = "/api/v0";

// type GenericError = Box<dyn std::error::Error + Send + Sync>;
// type Result<T> = std::result::Result<T, GenericError>;

// static INDEX: &[u8] = b"<a href=\"test.html\">test.html</a>";
static INTERNAL_SERVER_ERROR: &[u8] = b"Internal Server Error";
static NOTFOUND: &[u8] = b"Not Found";
static POST_DATA: &str = r#"{"original": "data"}"#;
static URL: &str = "http://127.0.0.1:1337/json_api";

async fn client_request_response() -> Result<Response<BoxBody>, AuthOpServerError> {
    let req = Request::builder()
        .method(Method::POST)
        .uri(URL)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Full::new(Bytes::from(POST_DATA)))
        .unwrap();

    let host = req.uri().host().expect("uri has no host");
    let port = req.uri().port_u16().expect("uri has no port");
    let stream = TcpStream::connect(format!("{}:{}", host, port)).await?;
    let io = TokioIo::new(stream);

    let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await?;

    tokio::task::spawn(async move {
        if let Err(err) = conn.await {
            println!("Connection error: {:?}", err);
        }
    });

    let web_res = sender.send_request(req).await?;

    let res_body = web_res.into_body().boxed();

    Ok(Response::new(res_body))
}

async fn api_post_response(req: Request<Incoming>) -> Result<Response<BoxBody>, AuthOpServerError> {
    // Aggregate the body...
    let whole_body = req.collect().await?.aggregate();
    // Decode as JSON...
    let mut data: serde_json::Value = serde_json::from_reader(whole_body.reader())?;
    // Change the JSON...
    data["test"] = serde_json::Value::from("test_value");
    // And respond with the new JSON.
    let json = serde_json::to_string(&data)?;
    let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(json))?;
    Ok(response)
}

async fn api_get_response() -> Result<Response<BoxBody>, AuthOpServerError> {
    let data = vec!["foo", "bar"];
    let res = match serde_json::to_string(&data) {
        Ok(json) => Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .body(full(json))
            .unwrap(),
        Err(_) => Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(full(INTERNAL_SERVER_ERROR))
            .unwrap(),
    };
    Ok(res)
}

pub async fn routes(
    req: Request<hyper::body::Incoming>,
    server_state: Arc<ServerState>,
) -> Result<Response<BoxBody>, AuthOpServerError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => cors(),
        // (&Method::GET, "/") => handle_server_status(),
        (&Method::GET, "/test.html") => client_request_response().await,
        (&Method::POST, "/json_api") => api_post_response(req).await,
        (&Method::GET, "/json_api") => api_get_response().await,
        _ => {
            // Return 404 not found response.
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}

// pub fn make_router(
//     server_state: Arc<ServerState>,
// ) -> Result<Router<Body, Infallible>, EmailAuthServerError> {
//     let r = Router::builder()
//         .data(server_state)
//         .middleware(Middleware::pre(middleware::logger))
//         .middleware(enable_cors_all())
//         .get("/", status_handler)
//         .get("/oauth/twitter", twitter::authenticate_twitter_account)
//         .post("*", middleware::not_found_handler)
//         .err_handler_with_info(middleware::error_handler)
//         .build()?;

//     Ok(r)
// }

// async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     let state = req.data::<Arc<ServerState>>().unwrap().clone();

//     let data = serde_json::json!({
//         "commit_hash": state.commit_hash.to_string(),
//         "launch_time": state.launch_time.to_string(),
//     });

//     let res = Response::builder()
//         .header(header::CONTENT_TYPE, "application/json")
//         .body(Body::from(data.to_string()))
//         .unwrap();

//     Ok(res)
// }
