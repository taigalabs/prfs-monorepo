use serde::{Deserialize, Serialize};

pub struct MerkleTree {}

impl MerkleTree {
    pub fn a() {}
}

#[derive(Debug, Clone)]
pub struct MerklePath {
    // Node idx at height
    pub idx: u128,

    pub direction: bool,

    // Node location, e.g. 0_1 refers to the second node in the lowest height
    pub node_loc: String,
}

// pub fn get_merkle_proof(leaves: &[&[u8]]) {
//     for (idx, leaf) in leaves.iter().enumerate() {
//         println!("idx: {}, leaf: {:?}", idx, leaf);
//     }
// }

#[derive(Serialize, Deserialize)]
struct MerkleProof {
    path_indices: Vec<u8>,
    root: String,
    siblings: Vec<String>,
}

// pub fn generate_auth_paths(idx: u128) -> MerkleProof {
// let height = 32;
// let mut auth_path = vec![];
// let mut curr_idx = idx;

// for h in 0..height {
//     let sibling_idx = get_sibling_idx(curr_idx);

//     let sibling_dir = if sibling_idx % 2 == 0 { true } else { false };

//     let p = MerklePath {
//         idx: sibling_idx,
//         direction: sibling_dir,
//         node_loc: format!("{}_{}", h, sibling_idx),
//     };

//     auth_path.push(p);

//     let parent_idx = get_parent_idx(curr_idx);
//     curr_idx = parent_idx;
// }

// auth_path
// }

fn get_sibling_idx(idx: u128) -> u128 {
    if idx % 2 == 0 {
        idx + 1
    } else {
        idx - 1
    }
}

pub fn get_parent_idx(idx: u128) -> u128 {
    idx / 2
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
