use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use std::convert::Infallible;
use std::net::SocketAddr;
use std::sync::atomic::AtomicUsize;
use std::sync::Arc;
use tokio::net::TcpListener;

use super::router::routes;
use super::state::ServerState;
use crate::AuthOpServerError;

const PORT: u16 = 4020;

pub async fn make_server(server_state: Arc<ServerState>) -> Result<(), AuthOpServerError> {
    let addr = SocketAddr::from(([127, 0, 0, 1], PORT));

    // let counter = Arc::new(AtomicUsize::new(0));

    // We create a TcpListener and bind it to 127.0.0.1:3000
    let listener = TcpListener::bind(addr).await?;

    let counter = Arc::new(AtomicUsize::new(0));

    // We start a loop to continuously accept incoming connections
    loop {
        let (stream, _) = listener.accept().await?;

        // Use an adapter to access something implementing `tokio::io` traits as if they implement
        // `hyper::rt` IO traits.
        let io = TokioIo::new(stream);

        let counter = counter.clone();

        // let server_state = server_state.clone();

        // let service = service_fn(move |_req| {
        //     // Get the current count, and also increment by 1, in a single
        //     // atomic operation.
        //     // let count = counter.fetch_add(1, Ordering::AcqRel);
        //     async move {
        //         let a = Ok::<_, AuthOpServerError>(Response::new(Full::new(Bytes::from(format!(
        //             "Request #{}",
        //             0
        //         )))));
        //         return a;
        //         // routes(req, server_state)
        //     }
        // });
        let service = service_fn(move |_req: Request<_>| {
            // Get the current count, and also increment by 1, in a single
            // atomic operation.
            // let count = counter.fetch_add(1, Ordering::AcqRel);
            &counter;
            async move {
                Ok::<_, AuthOpServerError>(Response::new(Full::new(Bytes::from(format!(
                    "Request",
                    // count
                )))))
            }
        });

        // Spawn a tokio task to serve multiple connections concurrently
        tokio::task::spawn(async move {
            // Finally, we bind the incoming connection to our `hello` service
            if let Err(err) = http1::Builder::new()
                // `service_fn` converts our function in a `Service`
                // .serve_connection(io, service_fn(routes))
                .serve_connection(io, service)
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
