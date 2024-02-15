use prfs_entities::sqlx::types::chrono::Utc;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ServerState {
    pub launched_at: String,
    pub circuits_build_path: PathBuf,
}

impl ServerState {
    pub fn init() -> ServerState {
        let circuits_build_path = prfs_circuits_circom::get_build_fs_path();

        assert!(
            circuits_build_path.exists(),
            "circuits build path should exist, path: {:?}",
            circuits_build_path
        );

        let launched_at = Utc::now().to_rfc3339();
        let s = ServerState {
            launched_at,
            circuits_build_path,
        };

        println!("Initializing prfs asset server state: {:?}", s);

        s
    }
}
