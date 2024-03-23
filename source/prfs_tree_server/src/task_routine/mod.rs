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
    pub tx: Arc<Sender<usize>>,
    pub rx: Arc<Mutex<Receiver<usize>>>,
}

impl TaskRoutine {
    pub fn init(task_queue: Arc<TreeServerTaskQueue>) -> TaskRoutine {
        let (tx, rx) = {
            let (tx, rx) = mpsc::channel(100);
            (Arc::new(tx), Arc::new(Mutex::new(rx)))
        };

        TaskRoutine { task_queue, tx, rx }
    }

    pub async fn start_routine(&self) {
        let rx = self.rx.clone();
        let mut rx_lock = rx.lock().await;

        while let Some(r) = rx_lock.recv().await {
            println!("receiving task, r: {}", r);
        }
    }
}
