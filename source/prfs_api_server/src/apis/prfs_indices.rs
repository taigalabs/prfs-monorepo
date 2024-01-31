use hyper::{body::Incoming, Request, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::{CircuitInput, PrfsProofType, PrfsSet},
    prfs_api_entities::{
        CreatePrfsProofTypeRequest, CreatePrfsProofTypeResponse, GetLeastRecentPrfsIndexRequest,
        GetLeastRecentPrfsIndexResponse, GetPrfsProofTypeByProofTypeIdRequest,
        GetPrfsProofTypeByProofTypeIdResponse, GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
        GetPrfsTreeLeafIndicesRequest,
    },
    sqlx::types::Json,
};
use std::{convert::Infallible, sync::Arc};

const LIMIT: i32 = 10;

pub async fn get_least_recent_index(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetLeastRecentPrfsIndexRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_indices = prfs::get_least_recent_prfs_index(pool, &req.prfs_indices)
        .await
        .unwrap();

    let mut free_idx = String::new();
    // Trial 1: Get any row that does not exist (free slot)
    for idx in prfs_indices.iter() {
        if let None = idx.key {
            free_idx = idx.key2.to_string();
            break;
        }
    }

    // Trial 2: Get the oldest slot
    if free_idx.len() == 0 {
        free_idx = prfs_indices.get(0).unwrap().key2.to_string();
    }

    let resp = ApiResponse::new_success(GetLeastRecentPrfsIndexResponse {
        prfs_index: free_idx,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_indices(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: GetLeastRecentPrfsIndexRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    let prfs_indices = prfs::get_least_recent_prfs_index(pool, &req.prfs_indices)
        .await
        .unwrap();

    let mut free_idx = String::new();
    // Trial 1: Get any row that does not exist (free slot)
    for idx in prfs_indices.iter() {
        if let None = idx.key {
            free_idx = idx.key2.to_string();
            break;
        }
    }

    // Trial 2: Get the oldest slot
    if free_idx.len() == 0 {
        free_idx = prfs_indices.get(0).unwrap().key2.to_string();
    }

    let resp = ApiResponse::new_success(GetLeastRecentPrfsIndexResponse {
        prfs_index: free_idx,
    });

    return Ok(resp.into_hyper_response());
}
