use hyper::{Body, Request, Response, StatusCode};
use routerify::{prelude::RequestExt, RequestInfo};
use std::convert::Infallible;

// A middleware which logs an http request.
pub async fn logger(req: Request<Body>) -> Result<Request<Body>, Infallible> {
    println!(
        "{} {} {}",
        req.remote_addr(),
        req.method(),
        req.uri().path()
    );
    Ok(req)
}

// Define an error handler function which will accept the `routerify::Error`
// and the request information and generates an appropriate response.
pub async fn error_handler(err: routerify::RouteError, _: RequestInfo) -> Response<Body> {
    eprintln!("{}", err);

    Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::from(format!("Something went wrong: {}", err)))
        .unwrap()
}
