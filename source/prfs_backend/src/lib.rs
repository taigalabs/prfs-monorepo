mod middleware;
mod routes;

use prfs_db_interface::database::Database;
pub use routes::*;
use std::sync::Arc;

pub type BackendError = Box<dyn std::error::Error + Send + Sync>;

pub struct State {
    pub db: Arc<Database>,
}
