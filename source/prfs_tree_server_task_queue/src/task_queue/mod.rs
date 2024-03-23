use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{
    mpsc::{self, Receiver, Sender},
    Mutex,
};

pub struct TaskQueue {
    task_map: HashMap<String, String>,
    tx: Arc<Sender<String>>,
    rx: Arc<Mutex<Receiver<String>>>,
}

impl TaskQueue {
    pub fn init() -> TaskQueue {
        let (tx, rx) = {
            let (tx, rx) = mpsc::channel(100);
            (Arc::new(tx), Arc::new(Mutex::new(rx)))
        };

        TaskQueue {
            task_map: HashMap::new(),
            tx,
            rx,
        }
    }

    fn fetch_tasks(&self) {}

    pub fn add_task(&self) {}

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
