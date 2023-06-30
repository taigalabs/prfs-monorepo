use std::process::Command;

pub fn run() {
    println!("[ci] Start executing e2e_test_node...");

    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let e2e_test_node_path = curr_dir.join("source/e2e_test_node");
    println!("e2e_test_node_path: {:?}", e2e_test_node_path);

    let status = Command::new("yarn")
        .current_dir(e2e_test_node_path)
        .args(["run", "bench"])
        .status()
        .expect("yarn command failed to start");

    assert!(status.success());
}
