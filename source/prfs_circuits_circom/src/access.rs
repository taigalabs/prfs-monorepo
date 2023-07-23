use super::paths::PATHS;
use crate::BuildJson;
use std::path::PathBuf;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}

pub fn read_build_json() -> BuildJson {
    let build_json = PATHS.build.join("build.json");
    let b = std::fs::read(&build_json).unwrap();

    let build_json: BuildJson = serde_json::from_slice(&b).expect("failed to read build_json");
    return build_json;
}
