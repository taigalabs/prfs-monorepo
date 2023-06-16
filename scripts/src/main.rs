use std::{env, fs, path::PathBuf};

fn main() {
    println!("Running scripts, curr_dir: {:?}", env::current_dir());

    build();
}

fn build() {
    println!("build");

    embed_spartan_wasm();
    // embed_membership_prover_circuit();
}

fn embed_spartan_wasm() {
    {
        let spartan_js_path = PathBuf::from("source/prfs_wasm/build/prfs_wasm.js");

        let js_str =
            fs::read_to_string(spartan_js_path).expect("prfs_wasm js needs to have been generated");

        let init_func_header = "async function init(input) {";
        let get_imports_stmt = "const imports = getImports()";

        let init_func_header_idx = js_str
            .find(init_func_header)
            .expect("init_func_header must exist");

        let mut get_imports_stmt_idx = js_str[init_func_header_idx..]
            .find(get_imports_stmt)
            .expect("get_imports_stmt must exist");

        get_imports_stmt_idx += init_func_header_idx;

        let str1 = &js_str[0..init_func_header_idx + init_func_header.len()];
        let str2 = &js_str[init_func_header_idx + init_func_header.len()..get_imports_stmt_idx];
        let str3 = &js_str[get_imports_stmt_idx..];

        let commented_out_code = format!("{}/*{}*/{}", str1, str2, str3);
        let wasm_js_path = PathBuf::from("source/prfs_js/src/prfs_wasm_embedded/prfs_wasm.js");
        fs::write(&wasm_js_path, commented_out_code).expect("prfs_wasm.js should be written");
        println!("File is written, path: {:?}", wasm_js_path);
    }

    {
        let prfs_wasm_path = PathBuf::from("source/prfs_wasm/build/prfs_wasm_bg.wasm");

        let wasm_bytes =
            fs::read(prfs_wasm_path).expect("prfs_wasm_bg.wasm needs to have been generated");
        let wasm_bytes: Vec<String> = wasm_bytes.iter().map(|b| b.to_string()).collect();

        let wasm_bytes_code = format!(
            "export const wasmBytes = new Uint8Array([{}])",
            wasm_bytes.join(",")
        );

        let wasm_bytes_js_path =
            PathBuf::from("source/prfs_js/src/prfs_wasm_embedded/prfs_wasm_bytes.ts");

        fs::write(&wasm_bytes_js_path, wasm_bytes_code)
            .expect("prfs_wasm_bytes.ts needs to written");
        println!("wasm_bytes_code is written, path: {:?}", wasm_bytes_js_path);
    }
}

fn embed_membership_prover_circuit() {
    let membership_prover_circuit_path =
        PathBuf::from("source/prfs_circuits/build/addr_membership2/addr_membership2.circuit");

    let membership_prover_circuit_bytes = fs::read(membership_prover_circuit_path)
        .expect("membership prover circuit needs to have been generated");
    let membership_prover_circuit_bytes: Vec<String> = membership_prover_circuit_bytes
        .iter()
        .map(|b| b.to_string())
        .collect();

    let circuit_bytes_code = format!(
        "export const circuitBytes = new Uint8Array([{}])",
        membership_prover_circuit_bytes.join(",")
    );

    let circuit_bytes_js_path =
        PathBuf::from("source/prfs_js/src/circuits/addr_membership2_wasm.ts");

    fs::write(&circuit_bytes_js_path, circuit_bytes_code)
        .expect("addr_membership2_wasm.js needs to written");
    println!(
        "wasm_bytes_code is written, path: {:?}",
        circuit_bytes_js_path
    );
}
