use hyper::service::service_fn;
use hyper::{Body, Request, Response, Server, StatusCode};
// use futures_util::future;
use hyper::http::response::Builder as ResponseBuilder;
use hyper_staticfile::Static;
use routerify::prelude::*;
use routerify::{Middleware, RequestInfo, Router, RouterService};
use std::convert::Infallible;
use std::io::Error as IoError;
use std::net::SocketAddr;
use std::path::Path;
use tokio::net::TcpListener;

// async fn handle_request<B>(req: Request<B>, static_: Static) -> Result<Response<Body>, IoError> {
//     if req.uri().path() == "/" {
//         let res = ResponseBuilder::new()
//             .status(StatusCode::MOVED_PERMANENTLY)
//             .header(header::LOCATION, "/hyper_staticfile/")
//             .body(Body::Empty)
//             .expect("unable to build response");
//         Ok(res)
//     } else {
//         static_.clone().serve(req).await
//     }
// }

// Define an app state to share it across the route handlers and middlewares.
struct State(u64);

// A handler for "/" page.
async fn home_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    // Access the app state.
    let state = req.data::<State>().unwrap();
    println!("State value: {}", state.0);

    Ok(Response::new(Body::from("Home page")))
}

// A handler for "/users/:userId" page.
async fn user_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let user_id = req.param("userId").unwrap();
    Ok(Response::new(Body::from(format!("Hello {}", user_id))))
}

// A middleware which logs an http request.
async fn logger(req: Request<Body>) -> Result<Request<Body>, Infallible> {
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
async fn error_handler(err: routerify::RouteError, _: RequestInfo) -> Response<Body> {
    eprintln!("{}", err);
    Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(Body::from(format!("Something went wrong: {}", err)))
        .unwrap()
}

// Create a `Router<Body, Infallible>` for response body type `hyper::Body`
// and for handler error type `Infallible`.
fn router() -> Router<Body, Infallible> {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let circuits_path = curr_dir.join("source/prfs_circuit_server/circuits");
    println!("circuits_path: {:?}", circuits_path);

    assert!(circuits_path
        .try_exists()
        .expect("circuits path should exist in the file system"));

    let static_ = Static::new(circuits_path);

    // Create a router and specify the logger middleware and the handlers.
    // Here, "Middleware::pre" means we're adding a pre middleware which will be executed
    // before any route handlers.
    Router::builder()
        // Specify the state data which will be available to every route handlers,
        // error handler and middlewares.
        .data(State(100))
        .middleware(Middleware::pre(logger))
        .get("/", home_handler)
        .get("/users/:userId", user_handler)
        .err_handler_with_info(error_handler)
        .build()
        .unwrap()
}

#[tokio::main]
async fn main() {
    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();

    let router = router();

    let service = RouterService::new(router).unwrap();

    let server = Server::bind(&addr).serve(service);

    println!("App is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }
}
