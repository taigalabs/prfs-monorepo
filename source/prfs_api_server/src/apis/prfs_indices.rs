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
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse, GetPrfsTreeLeafIndicesRequest,
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
    let rows = prfs::get_prfs_proof_types(pool, req.offset, LIMIT).await;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsProofTypesResponse { next_offset, rows });

    return Ok(resp.into_hyper_response());
}
