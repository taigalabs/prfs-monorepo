use super::compile_circuits::BuildCircuitJson;
use crate::paths::Paths;
use colored::Colorize;
use std::process::Command;

pub fn run(paths: &Paths) {
    run_app(paths);
}

fn run_app(paths: &Paths) {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&paths.prfs_backend)
        .args(["run", "-p", "prfs_backend"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
