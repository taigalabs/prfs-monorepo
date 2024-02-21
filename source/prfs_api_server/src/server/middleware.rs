use hyper::{body::Incoming, Request, Response, StatusCode};
use prfs_axum_lib::io::{full, ApiHandlerResult};
use prfs_common_server_state::ServerState;
use std::sync::Arc;

#[inline]
pub fn log(req: &Request<Incoming>) {
    println!("{} {}", req.method(), req.uri().path());
}

pub async fn handle_not_found(
    req: Request<Incoming>,
    _server_state: Arc<ServerState>,
) -> ApiHandlerResult {
    println!("Request handler not found, url: {:?}", req.uri());

    Ok(Response::builder()
        .status(StatusCode::NOT_FOUND)
        .body(full("Request handler not found"))
        .unwrap())
}

// pub async fn error_handler(err: routerify::RouteError, _: RequestInfo) ApiHandlerResult {
//     eprintln!("{}", err);

//     Response::builder()
//         .status(StatusCode::INTERNAL_SERVER_ERROR)
//         .body(Body::from(format!("Something went wrong: {}", err)))
//         .unwrap()
// }
