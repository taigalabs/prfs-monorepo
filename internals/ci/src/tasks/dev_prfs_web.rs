use std::process::Command;

pub fn run() {
    println!("[ci] Start executing e2e_test_web...");

    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_web_path = curr_dir.join("source/prfs_web");
    println!("prfs_web_path: {:?}", prfs_web_path);

    let status = Command::new("yarn")
        .current_dir(&prfs_web_path)
        .args(["run", "dev"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
