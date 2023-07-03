mod middleware;
mod routes;

use prfs_db_interface::Database;
pub use routes::*;
use std::sync::Arc;
use tokio_postgres::Client;

pub type BackendError = Box<dyn std::error::Error + Send + Sync>;

pub struct State {
    pub db: Arc<Database>,
}
