use colored::Colorize;
use prfs_common_server_state::ServerState;
use std::sync::Arc;

use crate::task_routine::update_tree;

pub struct TaskRoutine {
    // TODO: We don't have to hold the entire state here. We will change this later
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

            if let Err(err) =
                update_tree::do_update_prfs_tree_by_new_atst_task(&self.state, &atsts).await
            {
                tracing::error!("Task didn't succeed, err: {}", err);
            }

            for atst in atsts {
                task_map_lock.remove(&atst);
            }
        }

        tracing::warn!("exit start_routine()");
    }
}
