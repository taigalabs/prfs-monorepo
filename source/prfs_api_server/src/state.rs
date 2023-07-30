use crate::local::LocalAssets;
use prfs_db_interface::{database::Database, database2::Database2};

pub struct ServerState {
    pub db: Database,
    pub local_assets: LocalAssets,
    pub db2: Database2,
}
