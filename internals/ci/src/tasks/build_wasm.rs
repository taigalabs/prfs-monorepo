use std::{env, fs, path::PathBuf, process::Command};

const WASM_PACK_VERSION: &str = "wasm-pack 0.12.0";

pub fn build_wasm() {
    println!("\nBuilding wasm...");

    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

    {
        let output = Command::new("wasm-pack")
            .args(["--version"])
            .output()
            .expect("wasm-pack command failed to start");

        let wasm_pack_version = String::from_utf8(output.stdout).unwrap();
        if WASM_PACK_VERSION != wasm_pack_version.trim() {
            panic!(
                "wasm-pack wrong version, expected: {}, has: {}",
                WASM_PACK_VERSION,
                wasm_pack_version.trim()
            );
        }
    }

    {
        let prfs_wasm_build_path = prfs_wasm_build_path.to_str().unwrap();

        let status = Command::new("rm")
            .args(["-rf", &prfs_wasm_build_path])
            .status()
            .expect("rm command failed to start");

        assert!(status.success());

        let prfs_wasm_path = curr_dir.join("source/prfs_wasm");
        let prfs_wasm_path = prfs_wasm_path.to_str().unwrap();
        println!("prfs_wasm_path: {}", prfs_wasm_path);

        let status = Command::new("rustup")
            .current_dir(prfs_wasm_path)
            .args([
                "run",
                "nightly",
                "wasm-pack",
                "build",
                "--target",
                "web",
                "--out-dir",
                prfs_wasm_build_path,
            ])
            .status()
            .expect("wasm-pack command failed to start");
        assert!(status.success());
    }
}
