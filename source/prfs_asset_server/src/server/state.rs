use prfs_circuits_circom::CircuitBuildListJson;
use prfs_entities::sqlx::types::chrono::Utc;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ServerState {
    pub launched_at: String,
    pub circuits_build_path: PathBuf,
    pub circuit_built_at_launch: String,
}

impl ServerState {
    pub fn init() -> ServerState {
        let circuits_build_path = prfs_circuits_circom::get_build_fs_path();

        assert!(
            circuits_build_path.exists(),
            "circuits build path should exist, path: {:?}",
            circuits_build_path
        );

        let list_json_path = circuits_build_path.join("list.json");
        let b = std::fs::read(list_json_path).unwrap();
        let list_json = serde_json::from_slice::<CircuitBuildListJson>(&b).unwrap();

        let launched_at = Utc::now().to_rfc3339();
        let s = ServerState {
            launched_at,
            circuit_built_at_launch: list_json.timestamp,
            circuits_build_path,
        };

        println!("Initializing prfs asset server state: {:?}", s);

        s
    }
}
