use http_body_util::Full;
use hyper::{body::Body, header, service::service_fn, Response};
use hyper_014::body::Bytes;
use hyper_util::rt::TokioIo;
use hyper_utils::io::empty;
use std::{io::Empty, net::SocketAddr, sync::Arc};
use tokio::net::TcpListener;

use crate::server::{route, ServerState};

const PORT: u16 = 4010;

pub async fn run_server() {
    // let router = make_router(server_state);
    // // let service = RouterService::new(router).unwrap();
    // let addr: SocketAddr = ([0, 0, 0, 0], PORT).into();
    // let server = Server::bind(&addr).serve(service);

    // println!("Server is running on: {}", addr);

    // if let Err(err) = server.await {
    //     eprintln!("Server error: {}", err);
    // }
    //
    // let static_ = Static::new(Path::new("target/doc/"));
    let server_state = Arc::new(ServerState::init());

    let addr: SocketAddr = ([127, 0, 0, 1], 3000).into();
    let listener = TcpListener::bind(addr)
        .await
        .expect("Failed to create TCP listener");

    eprintln!("Doc server running on http://{}/", addr);
    loop {
        let (stream, _) = listener
            .accept()
            .await
            .expect("Failed to accept TCP connection");

        let server_state_clone = server_state.clone();
        tokio::spawn(async move {
            if let Err(err) = hyper::server::conn::http1::Builder::new()
                .serve_connection(
                    TokioIo::new(stream),
                    service_fn(move |req| route(req, server_state_clone.clone())),
                )
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
