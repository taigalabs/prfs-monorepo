use crate::asset_status::AssetStatus;
use hyper::http::response::Builder as ResponseBuilder;
use hyper::service::service_fn;
use hyper::{Body, Request, Response, Server, StatusCode};
use hyper_staticfile::Static;
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router, RouterService};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::io::Error as IoError;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio::sync::Mutex;

pub struct State {
    asset_status: Arc<Mutex<AssetStatus>>,
    static_serve: Static,
}

async fn home_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    // let state = req.data::<State>().unwrap();
    Ok(Response::new(Body::from("Home page")))
}

async fn asset_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<State>().unwrap();

    let uri_segment = req.uri().path();
    println!("url_sigment: {}", uri_segment);

    let uri_segment = uri_segment.strip_prefix("/assets").unwrap();

    let request = Request::get(format!("/{}", uri_segment)).body(()).unwrap();

    match state.static_serve.clone().serve(request).await {
        Ok(r) => return Ok(r),
        Err(err) => {
            return Ok(Response::new(Body::from(format!(
                "Error occurred: {}",
                err
            ))));
        }
    };

    // let circuit_name = req.param("circuitName").unwrap();

    // Ok(Response::new(Body::from(format!("Hello {}", circuit_name))))
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

pub fn make_router(
    asset_status: Arc<Mutex<AssetStatus>>,
    assets_path: &PathBuf,
) -> Router<Body, Infallible> {
    let static_serve = Static::new(assets_path);

    let state = State {
        static_serve,
        asset_status,
    };

    Router::builder()
        .data(state)
        .middleware(Middleware::pre(logger))
        .middleware(enable_cors_all())
        .get("/", home_handler)
        .get("/assets/*", asset_handler)
        .err_handler_with_info(error_handler)
        .build()
        .unwrap()
}
