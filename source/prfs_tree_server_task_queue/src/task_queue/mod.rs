use prfs_entities::PrfsAtstType;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

pub struct TreeServerTaskQueue {
    task_map: Arc<Mutex<HashMap<String, String>>>,
    tx: Arc<Sender<String>>,
    rx: Arc<Mutex<Receiver<String>>>,
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

    fn fetch_tasks(&self) {}

    pub async fn add_task(&self, atst_type: PrfsAtstType) {
        let task_map = self.task_map.clone();
        let mut task_map_lock = task_map.lock().await;
        task_map_lock.insert("po".into(), "".into());
    }

    fn wake(&self) {
        // tokio::spawn()
    }

    pub async fn start_routine(&self) {
        let rx = self.rx.clone();

        tokio::spawn(async move {
            let mut rx_lock = rx.lock().await;

            while let Some(r) = rx_lock.recv().await {}
            // let rc = Rc::new(());
            // task::yield_now().await;
            // use_rc(rc.clone());
        })
        .await
        .unwrap();
    }
}
