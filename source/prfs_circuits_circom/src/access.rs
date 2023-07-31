use super::paths::PATHS;
use crate::CircuitBuildJson;
use std::path::PathBuf;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}

pub fn read_circuit_build_json() -> CircuitBuildJson {
    let build_json = PATHS.build.join("build.json");
    let b = std::fs::read(&build_json).unwrap();

    let build_json: CircuitBuildJson =
        serde_json::from_slice(&b).expect("failed to read build_json");
    return build_json;
}
