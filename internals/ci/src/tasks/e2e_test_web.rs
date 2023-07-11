use crate::paths::Paths;
use std::process::Command;

pub fn run(paths: &Paths) {
    let status = Command::new("yarn")
        .current_dir(&paths.e2e_test_web)
        .args(["run", "bench"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
