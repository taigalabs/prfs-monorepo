use hyper::{Method, Request, Response, StatusCode};
use hyper_utils::cors::handle_cors;
use hyper_utils::error::ApiHandleError;
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use std::sync::Arc;

use crate::apis::{session, session_val};

static NOTFOUND: &[u8] = b"Not Found";
pub const ID_SESSION_API: &'static str = "/id_session_api";

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/id_session_api/v0/", $path)
    };
}

pub async fn id_session_server_routes(
    req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        (&Method::GET, v0_path!("open_prfs_id_session")) => {
            session::open_prfs_id_session(req, state).await
        }
        (&Method::POST, v0_path!("put_prfs_id_session_val")) => {
            session_val::put_prfs_id_session_val(req, state).await
        }
        _ => {
            println!("{} Route not found!, {}", ID_SESSION_API, req.uri());
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
