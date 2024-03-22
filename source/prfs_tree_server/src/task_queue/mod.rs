use std::collections::HashMap;

use prfs_web_fetcher::tokio;

pub struct TaskQueue {
    task_map: HashMap<String, String>,
}

impl TaskQueue {
    fn fetch_tasks(&self) {}

    pub fn wake(&self) {
        // tokio::spawn()
    }

    pub fn run(&self) {}
}
