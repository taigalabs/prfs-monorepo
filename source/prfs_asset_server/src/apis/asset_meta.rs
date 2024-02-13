use hyper::{Body, Request, Response};
use prfs_entities::asset::{GetPrfsAssetMetaRequest, GetPrfsAssetMetaResponse};
use std::convert::Infallible;

use super::request::parse_req;
use super::response::ApiResponse;

pub async fn get_prfs_asset_meta(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let req: GetPrfsAssetMetaRequest = parse_req(req).await;

    let resp = ApiResponse::new_success(GetPrfsAssetMetaResponse {
        driver_id: req.driver_id,
        // asset_urls: state.driver_asset_urls.clone(),
    });

    return Ok(resp.into_hyper_response());
}
