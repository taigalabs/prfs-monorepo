use hyper::body::Incoming;
use hyper::header::CONTENT_TYPE;
use hyper::{Request, Response, StatusCode};
use hyper_utils::io::{full, ApiHandlerResult};
use hyper_utils::resp::ApiResponse;
use multer::Multipart;
// use routerify::prelude::*;
use hyper_staticfile::Body;
use std::convert::Infallible;
use std::sync::Arc;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

use crate::paths::PATHS;
use crate::server::ServerState;

pub async fn get_assets(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<Body>, Infallible> {
    // let state = req.data::<Arc<ServerState>>().unwrap();

    let uri_segment = req.uri().path();
    let uri_segment = uri_segment.strip_prefix("/assets").unwrap();

    let request = Request::get(format!("/{}", uri_segment)).body(()).unwrap();
    match state.static_serve.clone().serve(request).await {
        Ok(r) => {
            // let b = full(r.body());
            // let resp = ApiResponse::new_success(b);
            return Ok(r);
        }

        Err(err) => {
            return Ok(Response::new(Body::Empty));
        }
    };
}

// pub async fn upload_assets(req: Request<Incoming>) -> ApiHandlerResult {
//     let boundary = req
//         .headers()
//         .get(CONTENT_TYPE)
//         .and_then(|ct| ct.to_str().ok())
//         .and_then(|ct| multer::parse_boundary(ct).ok());

//     // Send `BAD_REQUEST` status if the content-type is not multipart/form-data.
//     if boundary.is_none() {
//         return Ok(Response::builder()
//             .status(StatusCode::BAD_REQUEST)
//             .body(full("BAD REQUEST"))
//             .unwrap());
//     }

//     // Process the multipart e.g. you can store them in files.
//     if let Err(err) = process_multipart(req.into_body(), boundary.unwrap()).await {
//         return Ok(Response::builder()
//             .status(StatusCode::INTERNAL_SERVER_ERROR)
//             .body(full(format!("INTERNAL SERVER ERROR: {}", err)))
//             .unwrap());
//     }

//     let resp = ApiResponse::new_success("upload complete");
//     Ok(resp.into_hyper_response())
// }

// async fn process_multipart(body: Body, boundary: String) -> multer::Result<()> {
//     // Create a Multipart instance from the request body.
//     let mut multipart = Multipart::new(body, boundary);

//     // Iterate over the fields, `next_field` method will return the next field if
//     // available.
//     while let Some(mut field) = multipart.next_field().await? {
//         // Get the field name.
//         let name = field.name();

//         // Get the field's filename if provided in "Content-Disposition" header.
//         let file_name = field.file_name().unwrap();

//         // Get the "Content-Type" header as `mime::Mime` type.
//         let content_type = field.content_type();

//         println!(
//             "Name: {:?}, FileName: {:?}, Content-Type: {:?}",
//             name, file_name, content_type
//         );

//         let file_path = PATHS.assets.join(file_name);
//         let mut fd = File::create(file_path).await.unwrap();

//         // Process the field data chunks e.g. store them in a file.
//         let mut field_bytes_len = 0;
//         while let Some(field_chunk) = field.chunk().await? {
//             // Do something with field chunk.
//             fd.write(&field_chunk).await.unwrap();
//             field_bytes_len += field_chunk.len();
//         }

//         println!("Field Bytes Length: {:?}", field_bytes_len);
//     }

//     Ok(())
// }
