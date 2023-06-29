use std::{env, fs, path::PathBuf, process::Command};

pub fn run() {
    println!("[ci] Start executing dev_prfs_circuit_server...");

    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let bin = "cargo";
    let status = Command::new(bin)
        .args(["run", "-p", "prfs_circuit_server"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
