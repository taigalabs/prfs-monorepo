use hyper::{Body, Request, Response, StatusCode};
use prfs_entities::asset_entities::{GetPrfsAssetMetaRequest, GetPrfsAssetMetaResponse};
use routerify::prelude::*;
use std::convert::Infallible;
use std::sync::Arc;

use super::request::parse_req;
use super::response::ApiResponse;
use crate::server::ServerState;

pub async fn get_asset_meta(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap();
    let state = state.clone();

    let req: GetPrfsAssetMetaRequest = parse_req(req).await;

    let resp = ApiResponse::new_success(GetPrfsAssetMetaResponse {
        driver_id: req.driver_id,
        asset_urls: state.driver_asset_urls.clone(),
    });

    return Ok(resp.into_hyper_response());
}
