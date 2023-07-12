use crate::{apis::nodes, middleware, BackendError, State};
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::database::Database;
use routerify::prelude::*;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;

pub fn make_router(db: Database) -> Result<Router<Body, Infallible>, BackendError> {
    let db = Arc::new(db);
    let state = State { db };

    let r = Router::builder()
        .data(state)
        .middleware(Middleware::pre(middleware::logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .post("/get_nodes", nodes::get_nodes)
        // .post("/get_proof_types", proofs::get_proof_types)
        // .err_handler_with_info(middleware::error_handler)
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
