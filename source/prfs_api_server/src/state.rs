use crate::local::LocalAssets;
use prfs_db_interface::database::Database;

pub struct ServerState {
    pub db: Database,
    pub local_assets: LocalAssets,
}
