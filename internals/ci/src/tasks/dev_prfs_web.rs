use crate::paths::Paths;
use std::process::Command;

pub fn run(paths: &Paths) {
    println!("[ci] Start executing e2e_test_web...");

    inject_prfs_web_env(paths);
    run_app(paths);
}

fn inject_prfs_web_env(paths: &Paths) {}

fn run_app(paths: &Paths) {
    let status = Command::new("yarn")
        .current_dir(&paths.prfs_web)
        .args(["run", "dev"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
