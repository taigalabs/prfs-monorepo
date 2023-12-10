// use http_body_util::{BodyExt, Full};
// use hyper::body::{Buf, Bytes, Incoming};
// use hyper::{header, Method, Request, Response, StatusCode};
// use hyper_util::rt::TokioIo;
// use hyper_utils::cors::handle_cors;
// use hyper_utils::io::{full, BytesBoxBody};
// use std::sync::Arc;
// use tokio::net::TcpStream;

// use crate::apis::status::handle_server_status;
// use crate::apis::twitter::{self, RequestContext};
// use crate::AuthOpServerError;

// static INTERNAL_SERVER_ERROR: &[u8] = b"Internal Server Error";
// static NOTFOUND: &[u8] = b"Not Found";
// static POST_DATA: &str = r#"{"original": "data"}"#;
// static URL: &str = "http://127.0.0.1:1337/json_api";

// pub async fn routes(
//     req: Request<hyper::body::Incoming>,
//     server_state: Arc<ServerState>,
// ) -> Result<Response<BytesBoxBody>, AuthOpServerError> {
//     return match (req.method(), req.uri().path()) {
//         (&Method::OPTIONS, _) => handle_cors(),
//         (&Method::GET, "/") => handle_server_status(req, server_state),
//         (&Method::GET, "/oauth/twitter") => {
//             twitter::authenticate_twitter_account(req, server_state, RequestContext::Prod).await
//         }
//         (&Method::GET, "/oauth/twitter/dev") => {
//             twitter::authenticate_twitter_account(req, server_state, RequestContext::Dev).await
//         }
//         (&Method::GET, "/test.html") => client_request_response().await,
//         (&Method::POST, "/json_api") => api_post_response(req).await,
//         (&Method::GET, "/json_api") => api_get_response().await,
//         _ => {
//             // Return 404 not found response.
//             Ok(Response::builder()
//                 .status(StatusCode::NOT_FOUND)
//                 .body(full(NOTFOUND))
//                 .unwrap())
//         }
//     };
// }
