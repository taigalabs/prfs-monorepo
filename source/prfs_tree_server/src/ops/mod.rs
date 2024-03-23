use prfs_admin::mock::MASTER_ACCOUNT_IDS;
use prfs_api_rs::api;
use prfs_axum_lib::{bail_out_tx, resp::ApiResponse, ApiHandleError};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::{Acquire, Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::{ComputeCryptoAssetSizeTotalValuesRequest, PrfsAtstType};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use std::sync::Arc;

use crate::{envs::ENVS, PrfsTreeServerError};

const LIMIT: i32 = 20;

pub async fn _import_prfs_attestations_to_prfs_set(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    atst_type: &PrfsAtstType,
    dest_set_id: &String,
) -> Result<(String, u64), PrfsTreeServerError> {
    let _rows_deleted = prfs::delete_prfs_set_elements(tx, &dest_set_id).await?;

    let atsts = prfs::get_prfs_attestations(&pool, &atst_type, 0, 50000).await?;

    if atsts.len() > 65536 {
        return Err("Currently we can produce upto 65536 items".into());
    }

    let rows_affected =
        prfs::insert_asset_atsts_as_prfs_set_elements(tx, atsts, &dest_set_id).await?;

    return Ok((dest_set_id.to_string(), rows_affected));
}

pub async fn do_update_prfs_tree_by_new_atst_task(
    state: &Arc<ServerState>,
    atst_types: Vec<&PrfsAtstType>,
) -> Result<(), PrfsTreeServerError> {
    let pool = &state.db2.pool;

    for atst_type in atst_types {
        let resp = api::compute_crypto_asset_size_total_values(
            &ENVS.prfs_api_server_endpoint,
            &ComputeCryptoAssetSizeTotalValuesRequest {
                account_id: MASTER_ACCOUNT_IDS[0].to_string(),
            },
        )
        .await?;
        println!("compute crypto asset size payload: {:?}", resp.payload);

        let prfs_sets = prfs::get_prfs_sets_by_topic(pool, &atst_type.to_string()).await?;
        let mut tx = pool.begin().await?;

        for set in prfs_sets {
            _import_prfs_attestations_to_prfs_set(&pool, &mut tx, &atst_type, &set.set_id).await?;
        }
    }

    Ok(())
}
