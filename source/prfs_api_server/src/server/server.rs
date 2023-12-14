use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use prfs_common_server_state::ServerState;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::TcpListener;

use crate::server::router::route;

const PORT: u16 = 4000;

pub async fn make_server(server_state: Arc<ServerState>) -> Result<(), Box<dyn std::error::Error>> {
    let addr = SocketAddr::from(([0, 0, 0, 0], PORT));
    println!("prfs_api_server launching, addr: {}", addr);

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);
        let server_state = server_state.clone();

        let service = service_fn(move |req: Request<_>| {
            let s = server_state.clone();

            async move {
                let res = route(req, s).await;

                Ok::<_, hyper::Error>(res)
            }
        });

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                // `service_fn` converts our function in a `Service`
                .serve_connection(io, service)
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
