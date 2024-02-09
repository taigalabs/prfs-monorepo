use hyper::{body::Incoming, Request};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
    ApiHandleError,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse, ImportPrfsSetElementsRequest, ImportPrfsSetElementsResponse,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODES;

const LIMIT: i32 = 20;
const PRFS_ATTESTATION: &str = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS: &str = "crypto_asset_size_atsts";

pub async fn import_prfs_set_elements(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: ImportPrfsSetElementsRequest = parse_req(req).await;
    let pool = &state.db2.pool;

    if req.src_type != PRFS_ATTESTATION {
        return Err(ApiHandleError::from(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently only PRFS_ATTESTATION is importable".into(),
        ));
    }

    if req.src_id != CRYPTO_ASSET_SIZE_ATSTS {
        return Err(ApiHandleError::from(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently only CRYPTO_ASSET_SIZE_ATSTS is importable".into(),
        ));
    }

    let atsts = prfs::get_prfs_crypto_asset_size_atsts(&pool, 0, 50000)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    if atsts.len() > 65536 {
        return Err(ApiHandleError::from(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently we can produce upto 65536 items".into(),
        ));
    }

    let mut tx = pool.begin().await.unwrap();
    let rows_affected =
        prfs::insert_asset_atsts_as_prfs_set_elements(&mut tx, atsts, &req.dest_set_id)
            .await
            .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))?;
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ImportPrfsSetElementsResponse {
        set_id: req.dest_set_id.to_string(),
        rows_affected,
    });

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

    let prfs_set_element = prfs::get_prfs_set_element(&pool, &req.set_id, &req.label)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    let resp = ApiResponse::new_success(GetPrfsSetElementResponse { prfs_set_element });
    return Ok(resp.into_hyper_response());
}
