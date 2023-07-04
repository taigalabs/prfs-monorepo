use rs_merkle::Hasher;
// use sha2::{digest::FixedOutput, Digest, Sha256};
use poseidon::{self, poseidon_k256::hash};

#[derive(Clone)]
pub struct PoseidonHash {}

impl Hasher for PoseidonHash {
    type Hash = [u8; 32];

    fn hash(data: &[u8]) -> [u8; 32] {
        // let mut hasher = Sha256::new();

        // hash(data.to_vec());
        // hasher.update(data);
        // <[u8; 32]>::from(hasher.finalize_fixed())
        [0; 32]
    }
}
