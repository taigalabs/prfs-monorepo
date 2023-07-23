use crate::paths::PATHS;
use crate::state::ServerState;
use hyper::header::CONTENT_TYPE;
use hyper::{Body, Request, Response, StatusCode};
use multer::Multipart;
use routerify::prelude::*;
use std::convert::Infallible;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

pub async fn get_assets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<ServerState>().unwrap();

    let uri_segment = req.uri().path();
    println!("url_sigment: {}", uri_segment);

    let uri_segment = uri_segment.strip_prefix("/assets").unwrap();

    let request = Request::get(format!("/{}", uri_segment)).body(()).unwrap();

    match state.static_serve.clone().serve(request).await {
        Ok(r) => return Ok(r),
        Err(err) => {
            return Ok(Response::new(Body::from(format!(
                "Error occurred: {}",
                err
            ))));
        }
    };
}

pub async fn upload_assets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<ServerState>().unwrap();

    let boundary = req
        .headers()
        .get(CONTENT_TYPE)
        .and_then(|ct| ct.to_str().ok())
        .and_then(|ct| multer::parse_boundary(ct).ok());

    // Send `BAD_REQUEST` status if the content-type is not multipart/form-data.
    if boundary.is_none() {
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(Body::from("BAD REQUEST"))
            .unwrap());
    }

    // Process the multipart e.g. you can store them in files.
    if let Err(err) = process_multipart(req.into_body(), boundary.unwrap()).await {
        return Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(Body::from(format!("INTERNAL SERVER ERROR: {}", err)))
            .unwrap());
    }

    Ok(Response::new(Body::from("Success")))
}

async fn process_multipart(body: Body, boundary: String) -> multer::Result<()> {
    // Create a Multipart instance from the request body.
    let mut multipart = Multipart::new(body, boundary);

    // Iterate over the fields, `next_field` method will return the next field if
    // available.
    while let Some(mut field) = multipart.next_field().await? {
        // Get the field name.
        let name = field.name();

        // Get the field's filename if provided in "Content-Disposition" header.
        let file_name = field.file_name().unwrap();

        // Get the "Content-Type" header as `mime::Mime` type.
        let content_type = field.content_type();

        println!(
            "Name: {:?}, FileName: {:?}, Content-Type: {:?}",
            name, file_name, content_type
        );

        let file_path = PATHS.assets.join(file_name);
        let mut fd = File::create(file_path).await.unwrap();

        // Process the field data chunks e.g. store them in a file.
        let mut field_bytes_len = 0;
        while let Some(field_chunk) = field.chunk().await? {
            // Do something with field chunk.
            fd.write(&field_chunk).await.unwrap();
            field_bytes_len += field_chunk.len();
        }

        println!("Field Bytes Length: {:?}", field_bytes_len);
    }

    Ok(())
}
