mod build_e2e_test_web;
mod build_prfs_js;
mod build_wasm;
mod compile_circuits;
mod embed_prfs_wasm;

pub fn run() {
    println!("[ci] Start building...");

    build_wasm::build_wasm();
    compile_circuits::compile_circuits();
    embed_prfs_wasm::embed_prfs_wasm();
    build_prfs_js::build_prfs_js();
    build_e2e_test_web::build_e2e_test_web();
}
