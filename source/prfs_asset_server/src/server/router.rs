use hyper::{header, Body, Request, Response, StatusCode};
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;

use super::ServerState;
use crate::apis::{asset_meta, assets};

pub fn make_router(server_state: Arc<ServerState>) -> Router<Body, Infallible> {
    Router::builder()
        .data(server_state)
        .middleware(Middleware::pre(logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .get("/assets/*", assets::get_assets)
        .post("/upload", assets::upload_assets)
        .post(
            "/api/v0/get_prfs_asset_meta/",
            asset_meta::get_prfs_asset_meta,
        )
        .err_handler_with_info(error_handler)
        .build()
        .unwrap()
}

async fn status_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("status handler!");

    // let data = "prfs asset server is working".to_string();
    let data = serde_json::json!({
        "status": "Ok",
    });

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data.to_string()))
        .unwrap();

    Ok(res)
}

async fn logger(req: Request<Body>) -> Result<Request<Body>, Infallible> {
    println!(
        "{} {} {}",
        req.remote_addr(),
        req.method(),
        req.uri().path()
    );

    Ok(req)
}

async fn error_handler(err: routerify::RouteError, _: RequestInfo) -> Response<Body> {
    eprintln!("{}", err);

    Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::from(format!("Something went wrong: {}", err)))
        .unwrap()
}
