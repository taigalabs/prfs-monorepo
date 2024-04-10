use colored::Colorize;
use prfs_axum_lib::axum::{self, Router};
use prfs_axum_lib::tower_http::trace::TraceLayer;
use prfs_common_server_state::ServerState;
use std::net::SocketAddr;
use std::sync::Arc;

use crate::router::router2;
use crate::server::state::init_server_state;

const PORT_DEV: u16 = 4000;

pub async fn run_server() {
    let server_state = {
        let s = init_server_state().await.unwrap();
        Arc::new(s)
    };

    let port = if cfg!(debug_assertions) {
        PORT_DEV
    } else {
        let port = std::env::var("PRFS_API_SERVER_PORT").expect("server port should be provided");
        port.parse::<u16>().unwrap()
    };

    // let server_state_clone = server_state.clone();
    let _ = tokio::join!(
        serve(
            using_serve_dir_with_handler_as_service(server_state).await,
            port
        ),
        // start_listening_to_prfs_id_session_db_events(server_state_clone)
    );
}

async fn using_serve_dir_with_handler_as_service(server_state: Arc<ServerState>) -> Router {
    router2::route(server_state).await
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let local_addr = listener.local_addr().unwrap();

    tracing::info!("Listening on {}", local_addr.to_string().green());

    axum::serve(listener, app.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
