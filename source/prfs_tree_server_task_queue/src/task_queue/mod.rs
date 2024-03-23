use prfs_entities::PrfsAtstType;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

use crate::PrfsTreeServerTaskQueueError;

pub struct TreeServerTaskQueue {
    pub task_map: Arc<Mutex<HashMap<PrfsAtstType, bool>>>,
    pub tx: Arc<Sender<usize>>,
    pub rx: Arc<Mutex<Receiver<usize>>>,
}

impl TreeServerTaskQueue {
    pub fn init() -> TreeServerTaskQueue {
        let (tx, rx) = {
            let (tx, rx) = mpsc::channel(100);
            (Arc::new(tx), Arc::new(Mutex::new(rx)))
        };

        let task_map = Arc::new(Mutex::new(HashMap::new()));
        TreeServerTaskQueue { task_map, tx, rx }
    }

    pub async fn add_task(&self, atst_type: &PrfsAtstType) -> bool {
        println!("add_task()");
        let task_map = self.task_map.clone();
        let mut task_map_lock = task_map.lock().await;

        if !task_map_lock.contains_key(&atst_type) {
            println!("inserting!");
            task_map_lock.insert(atst_type.clone(), true);

            let tx = self.tx.clone();
            tokio::spawn(async move {
                tokio::time::sleep(Duration::from_secs(2)).await;

                println!("registering task!");
                if let Err(err) = tx.send(1).await {
                    println!("Failed to insert in task queue, err: {}", err);
                }
            });

            return true;
        } else {
            return false;
        }
    }
}
