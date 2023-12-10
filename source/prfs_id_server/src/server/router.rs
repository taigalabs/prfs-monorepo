use http_body_util::{BodyExt, Full};
use hyper::body::{Buf, Bytes, Incoming};
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use hyper_utils::cors::handle_cors;
use hyper_utils::io::{full, BytesBoxBody};
use prfs_common_server_state::ServerState;
use std::sync::Arc;
use tokio::net::TcpStream;

use crate::IdServerError;

static NOTFOUND: &[u8] = b"Not Found";

// As the project is at its early stage, 'prfs_id_server' runs on top of 'prfs_api_server'.
pub async fn id_server_routes(
    req: Request<hyper::body::Incoming>,
    server_state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, IdServerError> {
    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        _ => {
            // Return 404 not found response.
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(full(NOTFOUND))
                .unwrap())
        }
    };
}
