use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use prfs_common_server_state::ServerState;
use prfs_id_session_server::event_loop::start_listening_to_prfs_id_session_events;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::TcpListener;

use crate::server::router::route;
use crate::ApiServerError;

const PORT: u16 = 4000;

pub async fn make_server(server_state: Arc<ServerState>) -> Result<(), ApiServerError> {
    let addr = SocketAddr::from(([0, 0, 0, 0], PORT));
    println!("prfs_api_server launching, addr: {}", addr);

    let listener = TcpListener::bind(addr).await?;
    let mut http = http1::Builder::new();
    http.keep_alive(true);

    // Prfs id session server routine
    let server_state_clone = server_state.clone();
    tokio::task::spawn(async move {
        start_listening_to_prfs_id_session_events(server_state_clone)
            .await
            .unwrap();
    });

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

        let connection = http.serve_connection(io, service).with_upgrades();
        tokio::task::spawn(async move {
            if let Err(err) = connection.await {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
