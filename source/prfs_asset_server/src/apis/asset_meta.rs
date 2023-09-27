use hyper::header::CONTENT_TYPE;
use hyper::{Body, Request, Response, StatusCode};
use multer::Multipart;
use prfs_entities::apis_entities::{GetAssetMetaRequest, GetAssetMetaResponse};
use routerify::prelude::*;
use std::convert::Infallible;
use std::sync::Arc;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

use super::request::parse_req;
use super::response::ApiResponse;
use crate::paths::PATHS;
use crate::server::ServerState;

pub async fn get_asset_meta(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetAssetMetaRequest = parse_req(req).await;

    // let (prfs_proof_instances_syn1, table_row_count) =
    //     db_apis::get_prfs_proof_instances_syn1(pool, req.page_idx, req.page_size).await;

    let resp = ApiResponse::new_success(GetAssetMetaResponse {});

    return Ok(resp.into_hyper_response());
}
