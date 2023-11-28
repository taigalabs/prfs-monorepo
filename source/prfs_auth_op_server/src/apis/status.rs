use hyper::{Request, Response, StatusCode};

use crate::server::io::{full, BoxBody};
use crate::AuthOpServerError;

// pub async fn status_handler(req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     let state = req.data::<Arc<ServerState>>().unwrap().clone();

//     let data = serde_json::json!({
//         "commit_hash": state.commit_hash.to_string(),
//         "launch_time": state.launch_time.to_string(),
//     });

//     let res = Response::builder()
//         .header(header::CONTENT_TYPE, "application/json")
//         .body(Body::from(data.to_string()))
//         .unwrap();

//     Ok(res)
// }

pub fn handle_server_status(req: Request<BoxBody>) -> Result<Response<BoxBody>, AuthOpServerError> {
    let resp = Response::builder()
        .status(StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "*")
        .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        .body(full(""))
        .unwrap();

    Ok(resp)
}
