use super::paths::PATHS;
use crate::CircuitBuildListJson;
use std::path::PathBuf;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}

pub fn read_circuit_artifacts() -> CircuitBuildListJson {
    let build_list_json_path = PATHS.build.join("list.json");
    let b = std::fs::read(&build_list_json_path).unwrap();

    let build_list_json: CircuitBuildListJson =
        serde_json::from_slice(&b).expect("failed to read build_json");

    return build_list_json;
}
