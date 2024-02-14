use http_body_util::BodyExt;
use hyper::body::Incoming;
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_staticfile::Body;
use hyper_utils::cors::handle_cors;
use hyper_utils::io::{full, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use std::convert::Infallible;
use std::sync::Arc;

use super::ServerState;
use crate::apis::{asset_meta, assets};

// pub fn make_router(server_state: Arc<ServerState>) -> Router<Body, Infallible> {
//     Router::builder()
//         .data(server_state)
//         .middleware(Middleware::pre(logger))
//         .middleware(enable_cors_all())
//         .get("/", status_handler)
//         .get("/assets/*", assets::get_assets)
//         .post("/upload", assets::upload_assets)
//         .post(
//             "/api/v0/get_prfs_asset_meta/",
//             asset_meta::get_prfs_asset_meta,
//         )
//         .err_handler_with_info(error_handler)
//         .build()
//         .unwrap()
// }

// async fn handle_request<B>(req: Request<B>, static_: Static) -> Result<Response<Body>, IoError> {
//     if req.uri().path() == "/" {
//         let res = ResponseBuilder::new()
//             .status(StatusCode::MOVED_PERMANENTLY)
//             .header(header::LOCATION, "/hyper_staticfile/")
//             .body(Body::Empty)
//             .expect("unable to build response");
//         Ok(res)
//     } else {
//         static_.clone().serve(req).await
//     }
// }

// pub async fn route(req: Request<Incoming>, state: Arc<ServerState>) -> Response<BytesBoxBody> {
//     let resp = match (req.method(), req.uri().path()) {
//         (&Method::OPTIONS, _) => handle_cors(),
//         (&Method::GET, "/") => handle_server_status(req, state).await,
//         (&Method::GET, "/assets/*", assets::get_assets)
//         _ => handle_not_found(req, state).await,
//     };

//     // Inline const is not availble at the moment
//     // https://github.com/rodrimati1992/const_format_crates/issues/17
//     match resp {
//         Ok(r) => return r,
//         Err(err) => return ApiResponse::new_error(err).into_hyper_response(),
//     }
// }

async fn handle_server_status(
    _req: Request<Incoming>,
    _state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    println!("status handler!");

    // let data = "prfs asset server is working".to_string();
    let data = serde_json::json!({
        "status": "Ok",
    });

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(full(data.to_string()))
        .unwrap();

    Ok(res)
}

async fn handle_not_found(
    _req: Request<Incoming>,
    _state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiHandleError> {
    let resp = Response::builder()
        .status(StatusCode::NOT_FOUND)
        .body(full(format!("Resource not found",)))
        .unwrap();

    Ok(resp)
}

// async fn logger(req: Request<Incoming>) -> Result<Request<BytesBoxBody>, Infallible> {
//     println!(
//         "{} {} {}",
//         req.remote_addr(),
//         req.method(),
//         req.uri().path()
//     );

//     Ok(req)
// }
