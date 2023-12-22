use const_format::formatcp;
use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use hyper_utils::cors::handle_cors;
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use std::sync::Arc;
use tokio::net::TcpStream;

use crate::apis::twitter;

static NOTFOUND: &[u8] = b"Not Found";
pub const ATST_API: &'static str = "/atst_api";

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/atst_api/v0/", $path)
    };
}

pub async fn atst_server_routes(
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        (&Method::POST, v0_path!("scrape_tweet")) => twitter::scrape_tweet(req, state).await,
        _ => {
            println!("{} route not found!, {}", ATST_API, req.uri());
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
