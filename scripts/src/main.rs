mod build_wasm;
mod compile_circuits;
mod embed_prfs_wasm;

use std::{env, fs, path::PathBuf};

fn main() {
    println!("Running scripts, curr_dir: {:?}", env::current_dir());

    build();
}

fn build() {
    println!("build");

    build_wasm::build_wasm();
    compile_circuits::compile_circuits();
    embed_prfs_wasm::embed_prfs_wasm();
}
