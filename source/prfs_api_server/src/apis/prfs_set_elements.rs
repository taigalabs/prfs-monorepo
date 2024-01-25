use hyper::{body::Incoming, Request, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
    ApiHandleError,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::PrfsTreeNode,
    prfs_api_entities::{
        ComputePrfsSetMerkleRootRequest, ComputePrfsSetMerkleRootResponse,
        CreatePrfsDynamicSetElementRequest, CreatePrfsDynamicSetElementResponse,
        CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
        GetPrfsSetBySetIdResponse, GetPrfsSetsBySetTypeRequest, GetPrfsSetsRequest,
        GetPrfsSetsResponse, ImportPrfsSetElementsRequest, UpdatePrfsTreeNodeRequest,
    },
};
use prfs_tree_maker::tree_maker_apis;
use rust_decimal::Decimal;
use std::{convert::Infallible, sync::Arc};

use crate::error_codes::API_ERROR_CODES;

pub async fn import_prfs_set_elements(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: ImportPrfsSetElementsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let resp = ApiResponse::new_success(String::from(""));

    return Ok(resp.into_hyper_response());
}
