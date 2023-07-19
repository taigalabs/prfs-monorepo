use crate::state::ServerState;
use hyper::{Body, Request, Response, StatusCode};
use hyper_staticfile::Static;
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::path::PathBuf;

pub async fn serve_assets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<ServerState>().unwrap();

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
