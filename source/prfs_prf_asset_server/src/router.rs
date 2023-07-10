use hyper::{Body, Request, Response, StatusCode};
use hyper_staticfile::Static;
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::path::PathBuf;

pub struct State {
    static_serve: Static,
}

async fn home_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
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

pub fn make_router(assets_path: &PathBuf) -> Router<Body, Infallible> {
    let static_serve = Static::new(assets_path);

    let state = State { static_serve };

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
