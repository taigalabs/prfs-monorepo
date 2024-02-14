use axum::{
    extract::Request,
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, StatusCode},
    routing::get,
    Json, Router,
};
use http_body_util::Full;
use hyper::{body::Body, header, service::service_fn, Method, Response};
use hyper_014::body::Bytes;
use hyper_util::rt::TokioIo;
use hyper_utils::io::empty;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower::ServiceExt;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};

use super::ServerState;

// use crate::server::{route, ServerState};

const PORT: u16 = 4010;

pub async fn run_server() {
    tokio::join!(serve(using_serve_dir_with_handler_as_service(), PORT),);

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
    // let server_state = Arc::new(ServerState::init());

    // let addr: SocketAddr = ([127, 0, 0, 1], 3000).into();
    // let listener = TcpListener::bind(addr)
    //     .await
    //     .expect("Failed to create TCP listener");

    // eprintln!("Doc server running on http://{}/", addr);
    // loop {
    //     let (stream, _) = listener
    //         .accept()
    //         .await
    //         .expect("Failed to accept TCP connection");

    //     let server_state_clone = server_state.clone();
    //     tokio::spawn(async move {
    //         if let Err(err) = hyper::server::conn::http1::Builder::new()
    //             .serve_connection(
    //                 TokioIo::new(stream),
    //                 service_fn(move |req| route(req, server_state_clone.clone())),
    //             )
    //             .await
    //         {
    //             eprintln!("Error serving connection: {:?}", err);
    //         }
    //     });
    // }
}

fn using_serve_dir_with_handler_as_service() -> Router {
    async fn handle_404() -> (StatusCode, &'static str) {
        (StatusCode::NOT_FOUND, "Not found")
    }

    // you can convert handler function to service
    let service = handle_404.into_service();

    let serve_dir = ServeDir::new("assets").not_found_service(service);

    Router::new()
        .route("/foo", get(handle_server_status))
        .fallback_service(serve_dir)
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET]),
        )
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    // tracing::debug!("listening on {}", listener.local_addr().unwrap());

    println!("Asset server running on http://{}/", addr);
    axum::serve(listener, app.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}

#[derive(Serialize, Deserialize)]
pub struct ServerStatus {
    status: String,
}

async fn handle_server_status(// this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    // Json(payload): Json<ServerState>,
) -> (StatusCode, Json<ServerStatus>) {
    // insert your application logic here
    // let user = User {
    //     id: 1337,
    //     username: payload.username,
    // };

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (
        StatusCode::CREATED,
        Json(ServerStatus {
            status: "Ok".to_string(),
        }),
    )
}

// async fn handle_server_status(
//     _req: Request<Incoming>,
//     _state: Arc<ServerState>,
// ) -> Result<Response<BytesBoxBody>, ApiHandleError> {
//     println!("status handler!");

//     // let data = "prfs asset server is working".to_string();
//     let data = serde_json::json!({
//         "status": "Ok",
//     });

//     let res = Response::builder()
//         .header(header::CONTENT_TYPE, "application/json")
//         .body(full(data.to_string()))
//         .unwrap();

//     Ok(res)
// }
