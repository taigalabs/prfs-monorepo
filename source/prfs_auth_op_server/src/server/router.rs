use hyper::{header, Body, Request, Response};
use routerify::prelude::RequestExt;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;

use super::middleware;
use super::state::ServerState;
use crate::apis::{prfs_accounts, twitter};
use crate::EmailAuthServerError;

const PREFIX: &str = "/api/v0";

pub fn make_router(
    server_state: Arc<ServerState>,
) -> Result<Router<Body, Infallible>, EmailAuthServerError> {
    let r = Router::builder()
        .data(server_state)
        .middleware(Middleware::pre(middleware::logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .post("/oauth/twitter", twitter::authenticate_twitter_account)
        .post("*", middleware::not_found_handler)
        .err_handler_with_info(middleware::error_handler)
        .build()?;

    Ok(r)
}

async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let data = serde_json::json!({
        "commit_hash": state.commit_hash.to_string(),
        "launch_time": state.launch_time.to_string(),
    });

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data.to_string()))
        .unwrap();

    Ok(res)
}
