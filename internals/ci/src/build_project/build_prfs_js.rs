use std::{env, fs, path::PathBuf, process::Command};

pub fn build_prfs_js() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_js_path = curr_dir.join("source/prfs_js");
    println!("prfs_js_path: {:?}", prfs_js_path);

    let status = Command::new("yarn")
        .current_dir(prfs_js_path)
        .args(["run", "build"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
