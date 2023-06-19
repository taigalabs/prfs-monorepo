use std::{env, fs, path::PathBuf, process::Command};

pub fn build_e2e_test_web() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let e2e_test_web = curr_dir.join("source/e2e_test/web");
    println!("e2e_test_web: {:?}", e2e_test_web);

    let status = Command::new("yarn")
        .current_dir(e2e_test_web)
        .args(["run", "build"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
