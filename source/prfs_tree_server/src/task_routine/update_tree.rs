use ethers_core::{k256::U256, rand::rngs::OsRng};
use prfs_atst_api_ops::ops as atst_api_ops;
use prfs_common_server_state::ServerState;
use prfs_crypto::crypto_bigint::Random;
use prfs_db_interface::prfs;
use prfs_entities::PrfsAtstGroupId;
use std::sync::Arc;

use crate::{
    ops::{_create_prfs_tree_by_prfs_set, _import_prfs_attestations_to_prfs_set},
    PrfsTreeServerError,
};

pub async fn do_update_prfs_tree_by_new_atst_task(
    state: &Arc<ServerState>,
    atst_group_ids: &Vec<&PrfsAtstGroupId>,
) -> Result<(), PrfsTreeServerError> {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await?;

    let mut tree_ids = vec![];
    for atst_group_id in atst_group_ids {
        if **atst_group_id == PrfsAtstGroupId::crypto_1 {
            let resp =
                atst_api_ops::compute_crypto_asset_total_values(&mut tx, &state.infura_fetcher)
                    .await?;
            tracing::info!("Computed crypto asset payload: {:?}", resp);
        } else if **atst_group_id == PrfsAtstGroupId::nonce_seoul_1 {
            let resp = atst_api_ops::compute_group_member_atst_value(&mut tx).await?;
            tracing::info!("Computed group member value: {:?}", resp);
        }

        let prfs_sets = prfs::get_prfs_sets_by_atst_group_id__tx(&mut tx, &atst_group_id).await?;
        for set in prfs_sets {
            let (dest_set_id, import_count) =
                _import_prfs_attestations_to_prfs_set(&mut tx, &atst_group_id, &set.set_id).await?;

            tracing::info!(
                "Imported attestations into set, dest_set_id: {}, import_count: {}",
                dest_set_id,
                import_count
            );

            let u = U256::random(&mut OsRng);
            let tree_id = format!("0x{}", u.to_string().to_lowercase());

            let tree_label = format!("{}__tree__{}", &set.set_id, &tree_id);
            let (tree, _leaves_count) =
                _create_prfs_tree_by_prfs_set(&mut tx, &set.set_id, &tree_label, &tree_id).await?;

            tree_ids.push(tree.tree_id);
        }
    }

    tx.commit().await?;
    tracing::info!("Created new trees: {:?}", tree_ids);

    Ok(())
}
