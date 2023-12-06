use hyper::{Request, Response, StatusCode};
// use routerify::{prelude::RequestExt, RequestInfo};
use std::convert::Infallible;

// pub async fn logger(req: Request<Body>) -> Result<Request<Body>, Infallible> {
//     println!(
//         "{} {} {}",
//         req.remote_addr(),
//         req.method(),
//         req.uri().path()
//     );
//     Ok(req)
// }

// pub async fn not_found_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     println!("Request handler not found, url: {:?}", _req.uri());

//     Ok(Response::builder()
//         .status(StatusCode::NOT_FOUND)
//         .body(Body::from("Request handler not found"))
//         .unwrap())
// }

// pub async fn error_handler(err: routerify::RouteError, _: RequestInfo) -> Response<Body> {
//     eprintln!("{}", err);

//     Response::builder()
//         .status(StatusCode::INTERNAL_SERVER_ERROR)
//         .body(Body::from(format!("Something went wrong: {}", err)))
//         .unwrap()
// }
