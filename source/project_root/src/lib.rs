use std::path::PathBuf;

pub const PROJECT_ROOT: &'static str = "PROJECT_ROOT";

pub fn get_project_root() -> PathBuf {
    let ws_root = std::env::var(PROJECT_ROOT).unwrap();
    let ws_path = PathBuf::from(ws_root);

    ws_path
}