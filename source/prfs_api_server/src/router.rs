use crate::apis::{circuits, prfs_account, proofs};
use crate::state::ServerState;
use crate::ApiServerError;
use crate::{apis::nodes, middleware};
use hyper::{header, Body, Request, Response};
use prfs_db_interface::database::Database;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;

const PREFIX: &str = "/api/v0";

pub fn make_router(server_state: ServerState) -> Result<Router<Body, Infallible>, ApiServerError> {
    let state = Arc::new(server_state);

    let r = Router::builder()
        .data(state)
        .middleware(Middleware::pre(middleware::logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .post(
            format!("{}/prfs_account/sign_up", PREFIX),
            prfs_account::sign_up,
        )
        .post(
            format!("{}/circuits/get_circuits", PREFIX),
            circuits::get_circuits,
        )
        .post(
            format!("{}/prfs_account/sign_in", PREFIX),
            prfs_account::sign_in,
        )
        .post(format!("{}/get_nodes", PREFIX), nodes::get_nodes)
        .post(
            format!("{}/get_native_circuits", PREFIX),
            circuits::get_native_circuits,
        )
        .post(
            format!("{}/get_proof_types", PREFIX),
            proofs::get_proof_types,
        )
        .err_handler_with_info(middleware::error_handler)
        .build()?;

    Ok(r)
}

pub async fn status_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("status handler!");

    let data = "Ok".to_string();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
