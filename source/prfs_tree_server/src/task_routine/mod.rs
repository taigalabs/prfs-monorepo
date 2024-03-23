use colored::Colorize;
use prfs_admin::mock::MASTER_ACCOUNT_IDS;
use prfs_api_rs::api;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{ComputeCryptoAssetSizeTotalValuesRequest, PrfsAtstType};
use std::sync::Arc;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

use crate::{
    envs::ENVS,
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
        println!("{} start routine", "TaskRoutine".green());

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
    atst_types: &Vec<&PrfsAtstType>,
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
            // _create_prfs_tree_by_prfs_set(&pool, &mut tx, &set.set_id, tree_label, tree_id)
        }

        tx.commit().await?;
    }

    Ok(())
}
