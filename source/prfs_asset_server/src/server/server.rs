use axum::Router;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;

use super::route;

const PORT: u16 = 4010;

pub async fn run_server() {
    tokio::join!(serve(using_serve_dir_with_handler_as_service(), PORT),);
}

fn using_serve_dir_with_handler_as_service() -> Router {
    route()
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
