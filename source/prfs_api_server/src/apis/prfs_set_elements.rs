use hyper::{body::Incoming, Request, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
    ApiHandleError,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    atst_api_entities::GetCryptoAssetSizeAtstsRequest,
    entities::PrfsTreeNode,
    prfs_api_entities::{
        ComputePrfsSetMerkleRootRequest, ComputePrfsSetMerkleRootResponse,
        CreatePrfsDynamicSetElementRequest, CreatePrfsDynamicSetElementResponse,
        CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
        GetPrfsSetBySetIdResponse, GetPrfsSetElementRequest, GetPrfsSetElementResponse,
        GetPrfsSetElementsRequest, GetPrfsSetElementsResponse, GetPrfsSetsBySetTypeRequest,
        GetPrfsSetsRequest, GetPrfsSetsResponse, ImportPrfsSetElementsRequest,
        UpdatePrfsTreeNodeRequest,
    },
};
use prfs_tree_maker::tree_maker_apis;
use rust_decimal::Decimal;
use std::{convert::Infallible, sync::Arc};

use crate::error_codes::API_ERROR_CODES;

const LIMIT: i32 = 20;

pub async fn import_prfs_set_elements(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: ImportPrfsSetElementsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    println!("req: {:?}", req);

    let resp = ApiResponse::new_success(String::from(""));

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_set_elements(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsSetElementsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let rows = prfs::get_prfs_set_elements(&pool, &req.set_id, req.offset, LIMIT)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsSetElementsResponse { rows, next_offset });
    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_set_element(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsSetElementRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_set_element = prfs::get_prfs_set_element(&pool, &req.set_id, &req.atst_id)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    let resp = ApiResponse::new_success(GetPrfsSetElementResponse { prfs_set_element });
    return Ok(resp.into_hyper_response());
}
