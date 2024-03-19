use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::{resp::ApiResponse, ApiHandleError};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::tree_api::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse, ImportPrfsSetElementsRequest, ImportPrfsSetElementsResponse,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use std::sync::Arc;

use crate::PrfsTreeServerError;

const LIMIT: i32 = 20;
const PRFS_ATTESTATION: &str = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS: &str = "crypto_asset_size_atsts";

pub async fn _import_prfs_attestations_to_prfs_set(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    src_type: &String,
    src_id: &String,
    dest_set_id: &String,
) -> Result<(String, u64), PrfsTreeServerError> {
    if src_type != PRFS_ATTESTATION {
        return Err("Currently only PRFS_ATTESTATION is importable".into());
    }

    if src_id != CRYPTO_ASSET_SIZE_ATSTS {
        return Err("Currently only CRYPTO_ASSET_SIZE_ATSTS is importable".into());
    }

    prfs::delete_prfs_set_elements(tx, &dest_set_id).await?;

    let atsts = prfs::get_prfs_crypto_asset_size_atsts(&pool, 0, 50000)
        .await
        .map_err(|err| ApiHandleError::from(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    if atsts.len() > 65536 {
        return Err("Currently we can produce upto 65536 items".into());
    }

    let rows_affected = prfs::insert_asset_atsts_as_prfs_set_elements(tx, atsts, &dest_set_id)
        .await
        .map_err(|err| ApiHandleError::from(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err))?;

    return Ok((dest_set_id.to_string(), rows_affected));
}
