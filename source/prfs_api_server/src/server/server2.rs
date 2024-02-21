use axum::Router;
use prfs_common_server_state::ServerState;
use prfs_id_session_server::event_loop::start_listening_to_prfs_id_session_events;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::trace::TraceLayer;

use crate::router::router2;
use crate::server::state::init_server_state;

const PORT: u16 = 4000;

pub async fn run_server() {
    let server_state = {
        let s = init_server_state().await.unwrap();
        Arc::new(s)
    };

    let server_state_clone = server_state.clone();
    let _ = tokio::join!(
        serve(using_serve_dir_with_handler_as_service(server_state), PORT),
        start_listening_to_prfs_id_session_events(server_state_clone)
    );
}

fn using_serve_dir_with_handler_as_service(server_state: Arc<ServerState>) -> Router {
    router2::route(server_state)
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    println!("Asset server running on http://{}/", addr);
    tracing::info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
