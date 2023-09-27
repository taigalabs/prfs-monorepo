use hyper::header::CONTENT_TYPE;
use hyper::{Body, Request, Response, StatusCode};
use multer::Multipart;
use prfs_entities::asset_entities::{GetAssetMetaRequest, GetAssetMetaResponse};
use routerify::prelude::*;
use std::convert::Infallible;
use std::sync::Arc;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

use super::request::parse_req;
use super::response::ApiResponse;
use crate::envs::ENVS;
use crate::paths::PATHS;
use crate::server::ServerState;

pub async fn get_asset_meta(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetAssetMetaRequest = parse_req(req).await;

    let resp = ApiResponse::new_success(GetAssetMetaResponse {
        driver_id: req.driver_id,
        asset_urls: vec![],
    });

    return Ok(resp.into_hyper_response());
}
