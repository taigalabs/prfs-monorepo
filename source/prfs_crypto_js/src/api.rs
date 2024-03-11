use prfs_crypto::{poseidon::hash_from_bytes, MerkleProof};

use crate::PrfsDriverUtilsWasmError;

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
