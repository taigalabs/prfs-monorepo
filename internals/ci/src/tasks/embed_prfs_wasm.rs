use colored::Colorize;

use crate::{paths::Paths, task::Task, BuildHandle, CiError};
use std::{env, fs, process::Command};

pub struct EmbedPrfsWasmTask;

impl Task for EmbedPrfsWasmTask {
    fn name(&self) -> &str {
        "embed_prfs_wasm"
    }

    fn run(&self, build_handle: &mut BuildHandle, paths: &Paths) -> Result<(), CiError> {
        sanity_check(build_handle, paths);
        copy_wasm(paths);

        Ok(())
    }
}

fn sanity_check(build_handle: &BuildHandle, paths: &Paths) {
    let prfs_wasm_js_path = paths
        .wasm_build_path
        .join(format!("prfs_wasm_{}.js", build_handle.timestamp));

    let js_str =
        fs::read_to_string(prfs_wasm_js_path).expect("prfs_wasm js needs to have been generated");

    let url_stmt = "input = new URL('prfs_wasm_bg.wasm', import.meta.url)";

    // Compiled wasm.js shouldn't contain a fallback URL using "omit-default-module-path"
    // See https://github.com/rustwasm/wasm-pack/pull/1272
    if let Some(_) = js_str.find(url_stmt) {
        panic!("Compiled wasm.js contains a fallback URL. It should be removed");
    }
}

fn copy_wasm(paths: &Paths) {
    let prfs_wasm_embedded_path = paths.prfs_js_path.join("src/wasm_wrapper/build");

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
            paths.wasm_build_path.to_str().unwrap(),
            prfs_wasm_embedded_path.to_str().unwrap(),
        ])
        .status()
        .expect("cp command failed to start");

    assert!(status.success());
}
