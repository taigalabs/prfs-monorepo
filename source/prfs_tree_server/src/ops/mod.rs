use prfs_axum_lib::{resp::ApiResponse, ApiHandleError};
use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;

use crate::PrfsTreeServerError;

const LIMIT: i32 = 20;
// const PRFS_ATTESTATION: &str = "prfs_attestation";
// const CRYPTO_ASSET_SIZE_ATSTS: &str = "crypto_asset_size_atsts";

pub async fn _import_prfs_attestations_to_prfs_set(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    topic: &String,
    dest_set_id: &String,
) -> Result<(String, u64), PrfsTreeServerError> {
    let rows_deleted = prfs::delete_prfs_set_elements(tx, &dest_set_id).await?;

    let atsts = prfs::get_prfs_attestations(&pool, 0, 50000).await?;

    if atsts.len() > 65536 {
        return Err("Currently we can produce upto 65536 items".into());
    }

    let rows_affected =
        prfs::insert_asset_atsts_as_prfs_set_elements(tx, atsts, &dest_set_id).await?;

    return Ok((dest_set_id.to_string(), rows_affected));
}
