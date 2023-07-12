use std::sync::Arc;

use prfs_db_interface::database::Database;

pub struct ServerState {
    pub db: Arc<Database>,
}
