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

use crate::apis::prfs_identities;
use crate::IdServerError;

static NOTFOUND: &[u8] = b"Not Found";
pub const ID_API: &'static str = "/id_api";

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/id_api/v0/", $path)
    };
}

// As the project is at its early stage, 'prfs_id_server' runs on top of 'prfs_api_server'.
pub async fn id_server_routes(
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        // (&Method::POST, v0_path!("sign_up_prfs_identity")) => {
        //     prfs_identities::sign_up_prfs_identity(req, state).await
        // }
        // (&Method::POST, v0_path!("sign_in_prfs_identity")) => {
        //     prfs_identities::sign_in_prfs_identity(req, state).await
        // }
        _ => {
            println!("{} Route not found!, {}", ID_API, req.uri());
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
