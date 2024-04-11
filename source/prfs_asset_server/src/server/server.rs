use colored::Colorize;
use prfs_axum_lib::axum::{self, Router};
use prfs_axum_lib::tower_http::trace::TraceLayer;
use std::net::SocketAddr;

use super::route;

const PORT: u16 = 4010;

pub async fn run_server() {
    tokio::join!(serve(using_serve_dir_with_handler_as_service(), PORT),);
}

fn using_serve_dir_with_handler_as_service() -> Router {
    route()
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
