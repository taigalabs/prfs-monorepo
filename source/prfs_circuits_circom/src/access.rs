use super::paths::PATHS;
use std::path::PathBuf;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}

pub fn read_build_json() {
    let build_json = PATHS.build.join("build.json");
}
