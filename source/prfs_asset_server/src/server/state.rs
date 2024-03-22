use prfs_circuits_circom::CircuitBuildListJson;
use prfs_crypto::hex;
use prfs_crypto::sha2::{Digest, Sha256};
use prfs_db_driver::sqlx::types::chrono::Utc;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ServerState {
    pub launched_at: String,
    pub circuits_build_path: PathBuf,
    pub circuit_list_at_launch: CircuitBuildListJson,
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
        check_circuits(&circuits_build_path, &list_json);

        let launched_at = Utc::now().to_rfc3339();
        let s = ServerState {
            launched_at,
            circuits_build_path,
            circuit_list_at_launch: list_json,
        };

        println!("Initializing prfs asset server state: {:?}", s);

        s
    }
}

fn check_circuits(circuits_build_path: &PathBuf, list_json: &CircuitBuildListJson) {
    for circuit in &list_json.circuits {
        let path = circuits_build_path.join(&circuit.r1cs_src_path);
        let fd = std::fs::read(&path).unwrap();
        let mut hasher = Sha256::new();
        hasher.update(&fd);
        let digest = hex::encode(hasher.finalize());

        assert_eq!(
            circuit.file_hash, digest,
            "Old circuit binary. You may have to re-compile the circuits"
        );
    }
}
