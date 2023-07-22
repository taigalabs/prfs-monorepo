use prfs_db_interface::database::Database;
use std::sync::Arc;

pub struct ServerState {
    pub db: Arc<Database>,
}
