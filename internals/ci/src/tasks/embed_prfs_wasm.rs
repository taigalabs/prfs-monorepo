use std::{env, fs, path::PathBuf};

pub fn embed_prfs_wasm() {
    let curr_dir = env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
    println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

    let prfs_wasm_embedded_path = curr_dir.join("source/prfs_js/src/wasm_build");
    println!("prfs_wasm_embedded_path: {:?}", prfs_wasm_embedded_path);

    {
        let prfs_wasm_js_path = prfs_wasm_build_path.join("prfs_wasm.js");

        let js_str = fs::read_to_string(prfs_wasm_js_path)
            .expect("prfs_wasm js needs to have been generated");

        let url_stmt = "input = new URL('prfs_wasm_bg.wasm', import.meta.url)";
        // let url_stmt2 =
        //     "input = new URL('http://localhost:4010/circuits/prfs_wasm_bg.wasm', import.meta.url)";

        // Compiled wasm.js shouldn't contain a fallback URL using "omit-default-module-path"
        // See https://github.com/rustwasm/wasm-pack/pull/1272
        if let Some(_) = js_str.find(url_stmt) {
            panic!("Compiled wasm.js contains a fallback URL. It should be removed");
        }

        // let commented_out_code = js_str.replace(url_stmt, url_stmt2);
        // let wasm_js_path = curr_dir.join("source/prfs_js/src/wasm_build/prfs_wasm.js");
        // fs::write(&wasm_js_path, commented_out_code).expect("prfs_wasm.js should be written");
        // println!("File is written, path: {:?}", wasm_js_path);
    }

    {
        let files_to_copy = ["prfs_wasm.d.ts", "prfs_wasm.js"];

        for file in files_to_copy {
            let src_path = prfs_wasm_build_path.join(file);
            let dest_path = prfs_wasm_embedded_path.join(file);
            println!("copying a file, src: {:?}, dest: {:?}", src_path, dest_path);

            fs::copy(&src_path, &dest_path).unwrap();
        }
    }
}
