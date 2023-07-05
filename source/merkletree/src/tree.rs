use poseidon::poseidon_k256::hash_from_bytes;
use serde::{Deserialize, Serialize};

use crate::MerkleTreeError;

// pub struct MerkleTree {}

// impl MerkleTree {
//     pub fn a() {}
// }

#[derive(Serialize, Deserialize)]
pub struct MerkleProof {
    pub path_indices: Vec<u8>,
    pub root: String,
    pub siblings: Vec<String>,
}

const ZERO: [u8; 32] = [0u8; 32];

pub fn make_merkle_proof(
    leaves: Vec<[u8; 32]>,
    leaf_idx: u128,
    depth: u32,
) -> Result<MerkleProof, MerkleTreeError> {
    println!(
        "Creating merkle proof, leaves len: {}, leaf_idx: {}, depth: {}",
        leaves.len(),
        leaf_idx,
        depth
    );

    if leaves.len() < 1 {
        return Err("At least one leaf has to be provided".into());
    }

    if depth < 2 {
        return Err("Depth needs to be bigger than 1".into());
    }

    let depth: usize = depth.try_into().unwrap();

    let mut path_indices = vec![];
    let mut siblings = vec![];
    let mut nodes = Vec::with_capacity(depth + 1);
    nodes.push(leaves);

    for d in 0..depth {
        let mut parent = vec![];
        let children = nodes.get(0).unwrap();

        if children.len() < 1 {
            return Err(format!("children is len 0, d: {}", d).into());
        }

        if children.len() == 1 {
            let left = children.get(0).unwrap();
            let right = ZERO;

            let mut input = [0u8; 64];
            input[..32].clone_from_slice(left);
            input[32..].clone_from_slice(&right);

            let res = hash_from_bytes(&input).unwrap();
            parent.push(res);

            break;
        }

        for i in 0..children.len() {
            let left = children
                .get(i)
                .expect(&format!("left should always exist, d: {}, i: {}", d, i));

            let right = children.get(i + 1);

            if Some(r) = right {
            } else {
                break;
            }
        }
    }

    let p = MerkleProof {
        path_indices,
        root: "".to_string(),
        siblings,
    };

    Ok(p)
}

// pub trait Hasher: Clone {
//     /// This type is used as a hash type in the library.
//     /// It is recommended to use fixed size u8 array as a hash type. For example,
//     /// for sha256 the type would be `[u8; 32]`, representing 32 bytes,
//     /// which is the size of the sha256 digest. Also, fixed sized arrays of `u8`
//     /// by default satisfy all trait bounds required by this type.
//     ///
//     /// # Trait bounds
//     /// `Copy` is required as the hash needs to be copied to be concatenated/propagated
//     /// when constructing nodes.
//     /// `PartialEq` is required to compare equality when verifying proof
//     /// `Into<Vec<u8>>` is required to be able to serialize proof
//     /// `TryFrom<Vec<u8>>` is required to parse hashes from a serialized proof
//     type Hash: Copy + PartialEq + Into<Vec<u8>> + TryFrom<Vec<u8>>;

//     /// This associated function takes a slice of bytes and returns a hash of it.
//     /// Used by `concat_and_hash` function to build a tree from concatenated hashes
//     fn hash(data: &[u8]) -> Self::Hash;
// }
