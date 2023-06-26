use std::{env, fs, path::PathBuf, process::Command};

pub fn build_wasm() {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

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

        let status = Command::new("wasm-pack")
            .current_dir(prfs_wasm_path)
            .args([
                // "--omit-default-module-path",
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

    {
        let circuit_serve_path = curr_dir.join("source/prfs_circuit_server/circuits");
        println!("circuit_serve_path: {:?}", circuit_serve_path);

        let files_to_serve = ["prfs_wasm_bg.wasm"];

        for file in files_to_serve {
            let src_path = prfs_wasm_build_path.join(file);
            let dest_path = circuit_serve_path.join(file);
            println!("copying a file, src: {:?}, dest: {:?}", src_path, dest_path);

            fs::copy(&src_path, &dest_path).unwrap();
        }
    }
}
