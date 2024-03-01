use super::task::BuildTask;
use colored::Colorize;
use std::process::Command;

use crate::{deps, paths::PATHS, BuildHandle, CiError};

const WASM_PKG_NAME: &str = "prfs_driver_spartan_wasm";

pub struct BuildPrfsDriverSpartanWasmTask;

impl BuildTask for BuildPrfsDriverSpartanWasmTask {
    fn name(&self) -> &str {
        "BuildPrfsDriverSpartanWasmTask"
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
    let wasm_build_path = PATHS.prfs_driver_spartan_wasm_build.to_str().unwrap();

    let status = Command::new("rm")
        .args(["-rf", &wasm_build_path])
        .status()
        .expect("rm command failed to start");

    assert!(status.success());

    let wasm_path = PATHS.prfs_driver_spartan_wasm.to_str().unwrap();
    println!("wasm_path: {}", wasm_path);

    let out_name = format!("{}_{}", WASM_PKG_NAME, build_handle.timestamp);

    let status = Command::new("rustup")
        .current_dir(wasm_path)
        .args([
            "run",
            deps::RUST_NIGHTLY_TOOLCHAIN,
            "wasm-pack",
            "build",
            "--target",
            "web",
            "--out-dir",
            &wasm_build_path,
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
    let wasm_js_path = PATHS
        .prfs_driver_spartan_wasm_build
        .join(format!("{}_{}.js", WASM_PKG_NAME, build_handle.timestamp));

    let js_str = std::fs::read_to_string(wasm_js_path).expect(&format!(
        "{} js needs to have been generated",
        WASM_PKG_NAME
    ));

    let url_stmt = format!(
        "input = new URL('{}_bg.wasm', import.meta.url)",
        WASM_PKG_NAME
    );

    // Compiled wasm.js shouldn't contain a fallback URL using "omit-default-module-path"
    // See https://github.com/rustwasm/wasm-pack/pull/1272
    if let Some(_) = js_str.find(&url_stmt) {
        panic!("Compiled wasm.js contains a fallback URL. It should be removed");
    }
}

fn embed_wasm(build_handle: &BuildHandle) {
    let wasm_embedded_path = PATHS.prfs_driver_spartan_js.join("src/wasm_wrapper/build");

    println!(
        "{} a directory, path: {:?}",
        "Recreating".green(),
        wasm_embedded_path
    );

    if wasm_embedded_path.exists() {
        std::fs::remove_dir_all(&wasm_embedded_path).unwrap();
    }

    let status = Command::new("cp")
        .args([
            "-R",
            PATHS.prfs_driver_spartan_wasm_build.to_str().unwrap(),
            wasm_embedded_path.to_str().unwrap(),
        ])
        .status()
        .expect("cp command failed to start");

    assert!(status.success());

    let wasm_file_path = wasm_embedded_path.join(format!(
        "{}_{}_bg.wasm",
        WASM_PKG_NAME, build_handle.timestamp
    ));
    let wasm_bytes = std::fs::read(wasm_file_path).unwrap();
    let wasm_bytes_path = wasm_embedded_path.join(format!("{}_bytes.js", WASM_PKG_NAME));

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
