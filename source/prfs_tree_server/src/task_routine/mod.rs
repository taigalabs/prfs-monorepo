#[cfg(test)]
mod tests;

use colored::Colorize;
use ethers_core::{k256::U256, rand::rngs::OsRng};
use prfs_atst_api_ops::ops as atst_api_ops;
use prfs_common_server_state::ServerState;
use prfs_crypto::crypto_bigint::Random;
use prfs_db_interface::prfs;
use prfs_entities::PrfsAtstTypeId;
use std::sync::Arc;

use crate::{
    ops::{_create_prfs_tree_by_prfs_set, _import_prfs_attestations_to_prfs_set},
    PrfsTreeServerError,
};

pub struct TaskRoutine {
    // We don't have to hold the entire state here. We will change this later
    pub state: Arc<ServerState>,
}

impl TaskRoutine {
    pub fn init(state: Arc<ServerState>) -> TaskRoutine {
        TaskRoutine { state }
    }

    pub async fn start_routine(&self) {
        tracing::info!("{} start routine", "TaskRoutine".green());

        let mut rx = self.state.tree_server_task_queue.rx.lock().await;
        while let Some(_) = rx.recv().await {
            let mut task_map_lock = self.state.tree_server_task_queue.task_map.lock().await;
            let atsts = task_map_lock.clone();
            let atsts = atsts.keys().collect();

            if let Err(err) = do_update_prfs_tree_by_new_atst_task(&self.state, &atsts).await {
                tracing::error!("Task didn't succeed, err: {}", err);
            }

            for atst in atsts {
                task_map_lock.remove(&atst);
            }
        }
        println!("exit start_routine()");
    }
}

async fn do_update_prfs_tree_by_new_atst_task(
    state: &Arc<ServerState>,
    atst_type_ids: &Vec<&PrfsAtstTypeId>,
) -> Result<(), PrfsTreeServerError> {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await?;

    let mut tree_ids = vec![];
    for atst_type_id in atst_type_ids {
        if **atst_type_id == PrfsAtstTypeId::crypto_1 {
            let compute_resp =
                atst_api_ops::compute_crypto_asset_total_values(&pool, &mut tx).await?;
            tracing::info!("Computed crypto asset payload: {:?}", compute_resp);
        }

        let prfs_sets = prfs::get_prfs_sets_by_atst_type_id__tx(&mut tx, &atst_type_id).await?;
        for set in prfs_sets {
            let (dest_set_id, import_count) =
                _import_prfs_attestations_to_prfs_set(&mut tx, &atst_type_id, &set.set_id).await?;

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
