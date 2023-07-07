use console_error_panic_hook;
use serde::{Deserialize, Serialize};
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};

#[cfg(feature = "multicore")]
pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[derive(Serialize, Deserialize)]
pub struct MakeMerkleProofArgs {
    leaves: Vec<[u8; 32]>,
    leaf_idx: u128,
    depth: u32,
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn bb() -> Result<Vec<u8>, JsValue> {
    return Ok(vec![111]);
    // return Err(JsValue::from_str("aaa"));
    // Clamped(
    //     Generator::new(width, height, max_iterations)
    //         .iter_bytes()
    //         .collect(),
    // )
}

#[wasm_bindgen]
pub fn prove(circuit: &[u8], vars: &[u8], public_inputs: &[u8]) -> Result<Vec<u8>, JsValue> {
    return match prfs_lib::prove(circuit, vars, public_inputs) {
        Ok(p) => Ok(p),
        Err(err) => Err(JsValue::from_str(&err.to_string())),
    };
}

#[wasm_bindgen]
pub fn make_merkle_proof(
    // make_merkle_proof_args: JsValue,
    // circuit: &[u8],
    // vars: &[u8],
    // public_inputs: &[u8],
    // leaves: &[&[u8]],
    // leaf_idx: &[u8],
    // depth: u32,
    // leaves: Vec<&[u8]>,
    leaf_idx: &[u8],
    depth: &[u8],
) -> Result<Vec<u8>, JsValue> {
    log("popower");
    // let args: MakeMerkleProofArgs = serde_wasm_bindgen::from_value(leaves, leaf_idx, depth)?;

    // let r = match prfs_lib::make_merkle_proof(
    //     // args.leaves,
    //     leaf_idx, depth,
    // ) {
    //     Ok(p) => Ok(p),
    //     Err(err) => Err(JsValue::from_str(&err.to_string())),
    // };

    Ok(vec![])
}

#[wasm_bindgen]
pub fn verify(circuit: &[u8], proof: &[u8], public_input: &[u8]) -> Result<bool, JsValue> {
    return match prfs_lib::verify(circuit, proof, public_input) {
        Ok(p) => Ok(p),
        Err(err) => Err(JsValue::from_str(&err.to_string())),
    };
}

#[wasm_bindgen]
pub fn poseidon(input_bytes: &[u8]) -> Result<Vec<u8>, JsValue> {
    return match prfs_lib::poseidon(input_bytes) {
        Ok(p) => Ok(p),
        Err(err) => Err(JsValue::from_str(&err.to_string())),
    };
}
