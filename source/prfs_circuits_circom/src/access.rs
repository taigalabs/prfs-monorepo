use std::path::PathBuf;

use super::paths::PATHS;
use crate::CircuitBuildJson;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}

pub fn read_circuit_artifacts() -> CircuitBuildJson {
    let build_json_path = PATHS.build.join("build.json");

    let build_json: CircuitBuildJson =
        prfs_rust_utils::serde::read_json_file(&build_json_path).unwrap();

    return build_json;
}
