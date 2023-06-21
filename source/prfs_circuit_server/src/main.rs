use hyper::http::response::Builder as ResponseBuilder;
use hyper::http::{header, StatusCode};
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_staticfile::{Body, Static};
use std::io::Error as IoError;
use std::net::SocketAddr;
use std::path::Path;
use tokio::net::TcpListener;

async fn handle_request<B>(req: Request<B>, static_: Static) -> Result<Response<Body>, IoError> {
    if req.uri().path() == "/" {
        let res = ResponseBuilder::new()
            .status(StatusCode::MOVED_PERMANENTLY)
            .header(header::LOCATION, "/hyper_staticfile/")
            .body(Body::Empty)
            .expect("unable to build response");
        Ok(res)
    } else {
        static_.clone().serve(req).await
    }
}

#[tokio::main]
async fn main() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let circuits_path = curr_dir.join("source/prfs_circuit_server/circuits");
    println!("circuits_path: {:?}", circuits_path);

    assert!(circuits_path
        .try_exists()
        .expect("circuits path should exist in the file system"));

    // // Create a resolver. This can be cheaply cloned.
    // let resolver = hyper_staticfile::Resolver::new(circuits_path);

    // // A dummy request, but normally obtained from Hyper.
    // let request = hyper::http::Request::get("/foo/bar.txt").body(()).unwrap();

    // // First, resolve the request. Returns a future for a `ResolveResult`.
    // let result = resolver.resolve_request(&request).await.unwrap();

    // // // Then, build a response based on the result.
    // // // The `ResponseBuilder` is typically a short-lived, per-request instance.
    // let response = hyper_staticfile::ResponseBuilder::new()
    //     .request(&request)
    //     .build(result)
    //     .unwrap();

    // // println!("response: {}", response.into_body());
    // //

    let static_ = Static::new(circuits_path);

    let addr: SocketAddr = ([127, 0, 0, 1], 3000).into();
    let listener = TcpListener::bind(addr)
        .await
        .expect("Failed to create TCP listener");

    println!("Doc server running on http://{}/", addr);

    loop {
        let (stream, _) = listener
            .accept()
            .await
            .expect("Failed to accept TCP connection");

        let static_ = static_.clone();
        tokio::spawn(async move {
            if let Err(err) = hyper::server::conn::http1::Builder::new()
                .serve_connection(
                    stream,
                    service_fn(move |req| handle_request(req, static_.clone())),
                )
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
