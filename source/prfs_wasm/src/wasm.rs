use console_error_panic_hook;
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};

#[cfg(feature = "multicore")]
pub use wasm_bindgen_rayon::init_thread_pool;

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
