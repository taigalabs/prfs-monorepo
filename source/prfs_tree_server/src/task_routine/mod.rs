use colored::Colorize;
use prfs_common_server_state::ServerState;
use prfs_entities::PrfsAtstType;
use std::sync::Arc;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

use crate::ops::do_update_prfs_tree_by_new_atst_task;

pub struct TaskRoutine {
    // We don't have to hold the entire state here. We will change this later
    pub state: Arc<ServerState>,
}

impl TaskRoutine {
    pub fn init(state: Arc<ServerState>) -> TaskRoutine {
        // state.tree_server_task_queue.clone();
        TaskRoutine { state }
    }

    pub async fn start_routine(&self) {
        println!("{} start routine", "TaskRoutine".green());

        let mut rx = self.state.tree_server_task_queue.rx.lock().await;
        while let Some(_) = rx.recv().await {
            let task_map = self.state.tree_server_task_queue.task_map.clone();
            let mut task_map_lock = task_map.lock().await;
            let atsts: Vec<&PrfsAtstType> = task_map_lock.keys().collect();

            do_update_prfs_tree_by_new_atst_task(&self.state, atsts);
            // println!("receiving task, r: {}", r);
        }
        println!("exit start_routine()");
    }
}
