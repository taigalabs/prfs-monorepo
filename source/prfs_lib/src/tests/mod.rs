use rs_merkle::{Hasher, MerkleProof, MerkleTree};
use sha2::{digest::FixedOutput, Digest, Sha256};

pub type TestError = Box<dyn std::error::Error>;

mod merkle;
mod poseidon;
mod utils;

