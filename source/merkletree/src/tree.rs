use serde::{Deserialize, Serialize};

pub struct MerkleTree {}

impl MerkleTree {
    pub fn a() {}
}

pub fn get_merkle_proof(leaves: &[&[u8]]) {
    for (idx, leaf) in leaves.iter().enumerate() {
        println!("idx: {}, leaf: {:?}", idx, leaf);
    }
}

// auth_path
// }
#[derive(Serialize, Deserialize)]
struct MerkleProof {
    path_indices: Vec<u8>,
    root: String,
    siblings: Vec<String>,
}

pub trait Hasher: Clone {
    /// This type is used as a hash type in the library.
    /// It is recommended to use fixed size u8 array as a hash type. For example,
    /// for sha256 the type would be `[u8; 32]`, representing 32 bytes,
    /// which is the size of the sha256 digest. Also, fixed sized arrays of `u8`
    /// by default satisfy all trait bounds required by this type.
    ///
    /// # Trait bounds
    /// `Copy` is required as the hash needs to be copied to be concatenated/propagated
    /// when constructing nodes.
    /// `PartialEq` is required to compare equality when verifying proof
    /// `Into<Vec<u8>>` is required to be able to serialize proof
    /// `TryFrom<Vec<u8>>` is required to parse hashes from a serialized proof
    type Hash: Copy + PartialEq + Into<Vec<u8>> + TryFrom<Vec<u8>>;

    /// This associated function takes a slice of bytes and returns a hash of it.
    /// Used by `concat_and_hash` function to build a tree from concatenated hashes
    fn hash(data: &[u8]) -> Self::Hash;
}
