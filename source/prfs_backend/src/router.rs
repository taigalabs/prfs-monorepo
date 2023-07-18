use crate::apis::{prfs_account, proofs};
use crate::routes;
use crate::state::ServerState;
use crate::{apis::nodes, middleware, BackendError};
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::database::Database;
use routerify::prelude::*;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use std::sync::Arc;

const PREFIX: &str = "/api/v0";

pub fn make_router(db: Database) -> Result<Router<Body, Infallible>, BackendError> {
    let db = Arc::new(db);
    let state = ServerState { db };

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
            format!("{}/prfs_account/sign_in", PREFIX),
            prfs_account::sign_in,
        )
        .post(format!("{}/get_nodes", PREFIX), nodes::get_nodes)
        .post(
            format!("{}/get_proof_types", PREFIX),
            proofs::get_proof_types,
        )
        .err_handler_with_info(middleware::error_handler)
        .build()?;

    Ok(r)
}

pub async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("status handler!");

    let data = "Ok".to_string();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
