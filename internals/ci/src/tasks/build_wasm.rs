use colored::Colorize;

use crate::{paths::Paths, task::Task, BuildHandle, CiError};
use std::{path::PathBuf, process::Command};

const WASM_PACK_VERSION: &str = "wasm-pack 0.12.0";

pub struct BuildWasmTask;

impl Task for BuildWasmTask {
    fn name(&self) -> &str {
        "build_wasm"
    }

    fn run(&self, build_handle: &mut BuildHandle, paths: &Paths) -> Result<(), CiError> {
        // let out_name = format!("prfs_wasm_{}", build_handle.timestamp);

        check_version();
        build_wasm(build_handle, paths);
        copy_assets(build_handle, paths);
        sanity_check(build_handle, paths);
        embed_wasm(paths);

        Ok(())
    }
}

fn check_version() {
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

fn build_wasm(build_handle: &mut BuildHandle, paths: &Paths) {
    let prfs_wasm_build_path = paths.wasm_build_path.to_str().unwrap();

    let status = Command::new("rm")
        .args(["-rf", &prfs_wasm_build_path])
        .status()
        .expect("rm command failed to start");

    assert!(status.success());

    let prfs_wasm_path = paths.wasm_path.to_str().unwrap();
    println!("prfs_wasm_path: {}", prfs_wasm_path);

    let out_name = format!("prfs_wasm_{}", build_handle.timestamp);

    let status = Command::new("rustup")
        .current_dir(prfs_wasm_path)
        .args([
            "run",
            "nightly-2023-05-22-x86_64-unknown-linux-gnu",
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

fn copy_assets(build_handle: &BuildHandle, paths: &Paths) {
    let src_path = &paths.wasm_build_path;
    let dest_path = paths.prf_asset_serve_path.join("prfs_wasm");

    println!(
        "{} a file, src: {:?}, dest: {:?}",
        "Copying".green(),
        src_path,
        dest_path
    );

    let status = Command::new("cp")
        .args([
            "-R",
            src_path.to_str().unwrap(),
            dest_path.to_str().unwrap(),
        ])
        .status()
        .expect("cp command failed to start");

    assert!(status.success());
}

fn sanity_check(build_handle: &BuildHandle, paths: &Paths) {
    let prfs_wasm_js_path = paths
        .wasm_build_path
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

fn embed_wasm(paths: &Paths) {
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
