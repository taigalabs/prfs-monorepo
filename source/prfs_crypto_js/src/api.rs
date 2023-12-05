use prfs_crypto::{hash_from_bytes, MerkleProof};
use secq256k1::affine::Group;
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};
use web_sys::console;

use crate::PrfsDriverUtilsWasmError;

pub type G1 = secq256k1::AffinePoint;
pub type F1 = <G1 as Group>::Scalar;

pub fn poseidon(input_bytes: &[u8]) -> Result<Vec<u8>, PrfsDriverUtilsWasmError> {
    match hash_from_bytes(input_bytes) {
        Ok(r) => Ok(r.to_vec()),
        Err(err) => {
            return Err(err.to_string().into());
        }
    }
}

pub fn make_merkle_proof(
    leaves: Vec<String>,
    leaf_idx: u128,
    depth: u8,
) -> Result<MerkleProof, PrfsDriverUtilsWasmError> {
    match prfs_crypto::make_merkle_proof(leaves, leaf_idx, depth) {
        Ok(p) => return Ok(p),
        Err(err) => return Err(err.to_string().into()),
    };
}
