use std::{env, fs, path::PathBuf, process::Command};

pub fn copy_circuit_assets() {
    println!("\nCopying circuit assets...");

    let curr_dir = env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

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
