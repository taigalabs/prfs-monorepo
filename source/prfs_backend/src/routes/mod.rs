mod nodes;
mod proofs;

use crate::{middleware, State};
use hyper::{body, header, Body, Request, Response};
use prfs_db_interface::db::Database;
use prfs_db_interface::Node;
use routerify::prelude::*;
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use std::sync::Arc;

pub fn build_router(db: Database) -> Router<Body, Infallible> {
    let db = Arc::new(db);
    let state = State { db };

    Router::builder()
        .data(state)
        .middleware(Middleware::pre(middleware::logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .post("/get_nodes", nodes::get_nodes)
        // .post("/get_proof_types", proofs::get_proof_types)
        .err_handler_with_info(middleware::error_handler)
        .build()
        .unwrap()
}

pub async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("gen proof request");

    // let bytes = body::to_bytes(req.into_body()).await.unwrap();

    println!("status!");

    let data = "Success".to_string();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
