use std::{env, fs, path::PathBuf, process::Command};

pub fn build_wasm() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    let prfs_wasm_build_path = prfs_wasm_build_path.to_str().unwrap();

    let status = Command::new("rm")
        .args(["-rf", &prfs_wasm_build_path])
        .status()
        .expect("rm command failed to start");

    assert!(status.success());

    let prfs_wasm_path = curr_dir.join("source/prfs_wasm");
    let prfs_wasm_path = prfs_wasm_path.to_str().unwrap();
    println!("prfs_wasm_path: {}", prfs_wasm_path);

    let status = Command::new("wasm-pack")
        .current_dir(prfs_wasm_path)
        .args([
            "build",
            "--target",
            "web",
            "--out-dir",
            prfs_wasm_build_path,
        ])
        .status()
        .expect("wasm-pack command failed to start");
    assert!(status.success());

    println!("curr_dir: {:?}", curr_dir);

    let prfs_js_wasm_build_path = curr_dir.join("source/prfs_js/src/wasm_build");
    let prfs_js_wasm_build_path = prfs_js_wasm_build_path.to_str().unwrap();

    let status = Command::new("cp")
        .current_dir(prfs_wasm_path)
        .args([
            "-R",
            &format!("{}/.", prfs_wasm_build_path),
            &prfs_js_wasm_build_path,
        ])
        .status()
        .expect("cp command failed to start");
    assert!(status.success());
}
