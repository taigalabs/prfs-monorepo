use super::task::BuildTask;
use crate::{deps, paths::PATHS, BuildHandle, CiError};
use colored::Colorize;
use std::process::Command;

pub struct BuildPrfsDriverSpartanWasmTask;

impl BuildTask for BuildPrfsDriverSpartanWasmTask {
    fn name(&self) -> &str {
        stringify!(BuildPrfsDriverSpartanWasmTask)
    }

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError> {
        deps::check_wasm_pack();
        build_wasm(build_handle);
        sanity_check(build_handle);
        embed_wasm(build_handle);

        Ok(())
    }
}

fn build_wasm(build_handle: &mut BuildHandle) {
    let prfs_wasm_build_path = PATHS.prfs_driver_spartan_wasm_build.to_str().unwrap();

    let status = Command::new("rm")
        .args(["-rf", &prfs_wasm_build_path])
        .status()
        .expect("rm command failed to start");

    assert!(status.success());

    let prfs_wasm_path = PATHS.prfs_driver_spartan_wasm.to_str().unwrap();
    println!("prfs_wasm_path: {}", prfs_wasm_path);

    let out_name = format!("prfs_wasm_{}", build_handle.timestamp);

    let status = Command::new("rustup")
        .current_dir(prfs_wasm_path)
        .args([
            "run",
            deps::RUST_NIGHTLY_TOOLCHAIN,
            "wasm-pack",
            "build",
            "--target",
            "web",
            "--out-dir",
            prfs_wasm_build_path,
            "--out-name",
            &out_name,
            "--",
            "--features",
            "multicore",
        ])
        .status()
        .expect("wasm-pack command failed to start");

    assert!(status.success());
}

fn sanity_check(build_handle: &BuildHandle) {
    let prfs_wasm_js_path = PATHS
        .prfs_driver_spartan_wasm_build
        .join(format!("prfs_wasm_{}.js", build_handle.timestamp));

    let js_str = std::fs::read_to_string(prfs_wasm_js_path)
        .expect("prfs_wasm js needs to have been generated");

    let url_stmt = "input = new URL('prfs_wasm_bg.wasm', import.meta.url)";

    // Compiled wasm.js shouldn't contain a fallback URL using "omit-default-module-path"
    // See https://github.com/rustwasm/wasm-pack/pull/1272
    if let Some(_) = js_str.find(url_stmt) {
        panic!("Compiled wasm.js contains a fallback URL. It should be removed");
    }
}

fn embed_wasm(build_handle: &BuildHandle) {
    let prfs_wasm_embedded_path = PATHS.prfs_driver_spartan_js.join("src/wasm_wrapper/build");

    println!(
        "{} a directory, path: {:?}",
        "Recreating".green(),
        prfs_wasm_embedded_path
    );

    if prfs_wasm_embedded_path.exists() {
        std::fs::remove_dir_all(&prfs_wasm_embedded_path).unwrap();
    }

    let status = Command::new("cp")
        .args([
            "-R",
            PATHS.prfs_driver_spartan_wasm_build.to_str().unwrap(),
            prfs_wasm_embedded_path.to_str().unwrap(),
        ])
        .status()
        .expect("cp command failed to start");

    assert!(status.success());

    let wasm_file_path =
        prfs_wasm_embedded_path.join(format!("prfs_wasm_{}_bg.wasm", build_handle.timestamp));
    let wasm_bytes = std::fs::read(wasm_file_path).unwrap();
    let wasm_bytes_path = prfs_wasm_embedded_path.join("prfs_wasm_bytes.js");

    let wasm_bytes_str = wasm_bytes
        .iter()
        .map(|b| b.to_string())
        .collect::<Vec<String>>()
        .join(",");

    let contents = format!(
        "export const wasmBytes = new Uint8Array([{}]);",
        wasm_bytes_str,
    );

    std::fs::write(wasm_bytes_path, contents).unwrap();
}
