use hyper::{Body, Request, Response, StatusCode};
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;

use super::ServerState;
use crate::apis::{asset_meta, assets};

pub fn make_router(server_state: ServerState) -> Router<Body, Infallible> {
    Router::builder()
        .data(server_state)
        .middleware(Middleware::pre(logger))
        .middleware(enable_cors_all())
        .get("/", home_handler)
        .get("/assets/*", assets::get_assets)
        .post("/upload", assets::upload_assets)
        .get(
            "/api/v0/get_prfs_asset_meta/",
            asset_meta::get_prfs_asset_meta,
        )
        .err_handler_with_info(error_handler)
        .build()
        .unwrap()
}

async fn home_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    // let state = req.data::<State>().unwrap();

    Ok(Response::new(Body::from("Home page")))
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
