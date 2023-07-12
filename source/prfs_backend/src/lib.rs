mod apis;
mod middleware;
pub mod router;

use prfs_db_interface::database::Database;
use std::sync::Arc;

pub type BackendError = Box<dyn std::error::Error + Send + Sync>;

pub struct State {
    pub db: Arc<Database>,
}
