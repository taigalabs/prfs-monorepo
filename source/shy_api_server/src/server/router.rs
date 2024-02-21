use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use prfs_axum_lib::cors::handle_cors;
use prfs_axum_lib::error::ApiHandleError;
use prfs_axum_lib::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use std::sync::Arc;
use tokio::net::TcpStream;

use crate::apis::{channels, posts};

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
        (&Method::POST, v0_path!("create_shy_post")) => posts::create_shy_post(req, state).await,
        (&Method::POST, v0_path!("get_shy_posts")) => posts::get_shy_posts(req, state).await,
        (&Method::POST, v0_path!("get_shy_channels")) => {
            channels::get_shy_channels(req, state).await
        }
        _ => {
            println!("{} route not found!, {}", SHY_API, req.uri());
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
