use std::sync::Arc;

use http_body_util::Full;
use hyper::{header, Request, Response, StatusCode};

use crate::server::io::{full, BoxBody};
use crate::server::state::ServerState;
use crate::AuthOpServerError;

// pub async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
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

pub fn handle_server_status(
    _req: Request<hyper::body::Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BoxBody>, AuthOpServerError> {
    let data = serde_json::json!({
        "commit_hash": state.commit_hash.to_string(),
        "launch_time": state.launch_time.to_string(),
    });

    let resp = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(data.to_string()))
        .unwrap();

    Ok(resp)
}
