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

use crate::apis::posts;

static NOTFOUND: &[u8] = b"Not Found";
pub const SHY_API: &'static str = "/shy_api";

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/shy_api/v0/", $path)
    };
}

pub async fn shy_server_routes(
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        (&Method::POST, v0_path!("create_post")) => posts::create_post(req, state).await,
        (&Method::POST, v0_path!("get_posts")) => posts::get_posts(req, state).await,
        _ => {
            println!("{} route not found!, {}", SHY_API, req.uri());
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
