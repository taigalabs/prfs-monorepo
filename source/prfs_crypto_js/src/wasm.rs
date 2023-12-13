use crate::api;
use console_error_panic_hook;
use serde::{Deserialize, Serialize};
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};
use web_sys::console;

#[cfg(feature = "multicore")]
pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MakeMerkleProofArgs {
    pub leaves: Vec<String>,
    pub leaf_idx: u128,
    pub depth: u8,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MerkleProof2 {
    pub path_indices: Vec<u128>,
    pub root: String,
    pub siblings: Vec<String>,
}

#[wasm_bindgen]
pub fn make_merkle_proof(make_merkle_proof_args: JsValue) -> Result<JsValue, JsValue> {
    let args: MakeMerkleProofArgs = serde_wasm_bindgen::from_value(make_merkle_proof_args)?;

    // log(&format!("merkle proof args: {:?}", args));

    let proof = match api::make_merkle_proof(args.leaves, args.leaf_idx, args.depth) {
        Ok(p) => p,
        Err(err) => return Err(JsValue::from_str(&err.to_string())),
    };

    // log(&format!(
    //     "merkle proof in wasm, siblings: {:?}",
    //     proof.siblings
    // ));

    return match serde_wasm_bindgen::to_value(&proof) {
        Ok(p) => Ok(p),
        Err(err) => Err(JsValue::from(&err.to_string())),
    };
}

#[wasm_bindgen]
pub fn poseidon(input_bytes: &[u8]) -> Result<Vec<u8>, JsValue> {
    return match api::poseidon(input_bytes) {
        Ok(p) => Ok(p),
        Err(err) => Err(JsValue::from_str(&err.to_string())),
    };
}

#[wasm_bindgen]
pub fn poseidon_2(arg1: &[u8], arg2: &[u8]) -> Result<Vec<u8>, JsValue> {
    let a1: &[u8; 32] = match arg1.try_into() {
        Ok(v) => v,
        Err(err) => {
            return Err(JsValue::from_str(&format!(
                "Argument needs to be 32-byte long, err: {}",
                err,
            )))
        }
    };

    let a2: &[u8; 32] = match arg2.try_into() {
        Ok(v) => v,
        Err(err) => {
            return Err(JsValue::from_str(&format!(
                "Argument needs to be 32-byte long, err: {}",
                err,
            )))
        }
    };

    return match api::poseidon_2(a1, a2) {
        Ok(p) => Ok(p.to_vec()),
        Err(err) => Err(JsValue::from_str(&err.to_string())),
    };
}
