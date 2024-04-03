use prfs_crypto::hex;
use prfs_crypto::sha2::{Digest, Sha256};
use prfs_entities::PrfsCircuit;

use crate::paths::PATHS;
use crate::resolve_path::get_path_segment;
use crate::FileKind;

pub fn create_digest(circuit: &PrfsCircuit) -> String {
    let r1cs_src_path = PATHS.build.join(get_path_segment(circuit, FileKind::R1CS));
    let b =
        std::fs::read(&r1cs_src_path).expect(&format!("file not found, path: {:?}", r1cs_src_path));

    let mut hasher = Sha256::new();
    hasher.update(&b);
    let digest = hex::encode(hasher.finalize());

    return digest;
}
