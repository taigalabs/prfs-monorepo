use std::process::Command;

pub const CARGO: &str = "cargo";
pub const SH: &str = "sh";
pub const DOCKER: &str = "docker";
pub const JS_ENGINE: &str = "pnpm";
pub const NODE_VERSION: &str = "v18";
pub const WASM_PACK_VERSION: &str = "wasm-pack 0.12.1";
pub const RUST_NIGHTLY_TOOLCHAIN: &str = "nightly-2024-02-14-x86_64-unknown-linux-gnu";

pub fn check_wasm_pack() {
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

pub fn check_nodejs() {
    let cmd = "node";
    let output = Command::new("node")
        .args(["--version"])
        .output()
        .expect(&format!("{} command failed to start", cmd));

    let node_version = String::from_utf8(output.stdout).unwrap();
    if !node_version.starts_with(NODE_VERSION) {
        panic!(
            "node wrong version, expected: {}, has: {}",
            NODE_VERSION, node_version,
        );
    }
}
