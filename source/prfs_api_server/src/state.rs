use crate::local::LocalAssets;
use prfs_circuits_circom::BuildJson;
use prfs_db_interface::database::Database;
use std::sync::Arc;

pub struct ServerState {
    pub db: Arc<Database>,
    pub build_json: BuildJson,
}
