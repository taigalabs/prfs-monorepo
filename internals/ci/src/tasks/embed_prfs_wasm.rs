use std::{env, fs, process::Command};

pub fn embed_prfs_wasm() {
    let curr_dir = env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

    let prfs_wasm_embedded_path = curr_dir.join("source/prfs_js/src/wasm_wrapper/build");
    println!("prfs_wasm_embedded_path: {:?}", prfs_wasm_embedded_path);

    {
        let prfs_wasm_js_path = prfs_wasm_build_path.join("prfs_wasm.js");

        let js_str = fs::read_to_string(prfs_wasm_js_path)
            .expect("prfs_wasm js needs to have been generated");

        let url_stmt = "input = new URL('prfs_wasm_bg.wasm', import.meta.url)";

        // Compiled wasm.js shouldn't contain a fallback URL using "omit-default-module-path"
        // See https://github.com/rustwasm/wasm-pack/pull/1272
        if let Some(_) = js_str.find(url_stmt) {
            panic!("Compiled wasm.js contains a fallback URL. It should be removed");
        }
    }

    {
        let status = Command::new("rm")
            .args(["-rf", prfs_wasm_embedded_path.to_str().unwrap()])
            .status()
            .expect("cp command failed to start");
        assert!(status.success());
    }

    {
        let status = Command::new("cp")
            .args([
                "-R",
                prfs_wasm_build_path.to_str().unwrap(),
                prfs_wasm_embedded_path.to_str().unwrap(),
            ])
            .status()
            .expect("cp command failed to start");
        assert!(status.success());
    }
}
