use prfs_entities::PrfsAtstType;
use prfs_tree_server_task_queue::TreeServerTaskQueue;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

pub struct TaskRoutine {
    pub task_queue: Arc<TreeServerTaskQueue>,
}

impl TaskRoutine {
    pub fn init(task_queue: Arc<TreeServerTaskQueue>) -> TaskRoutine {
        TaskRoutine { task_queue }
    }

    pub async fn start_routine(&self) {
        let mut rx = self.task_queue.rx.lock().await;
        while let Some(r) = rx.recv().await {
            println!("receiving task, r: {}", r);
        }
        println!("exit start_routine()");
    }
}
