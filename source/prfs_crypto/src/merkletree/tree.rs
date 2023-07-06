use super::merklepath::{make_sibling_path, SiblingPath};
use crate::{hash_two, PrfsCryptoError};
// use poseidon::poseidon_k256::{hash_from_bytes, hash_two};
use serde::{Deserialize, Serialize};

pub const ZERO: [u8; 32] = [0u8; 32];

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MerkleProof {
    pub path_indices: Vec<u8>,
    pub root: Vec<u8>,
    pub siblings: Vec<String>,
}

pub fn make_merkle_proof(
    leaves: Vec<[u8; 32]>,
    leaf_idx: u128,
    depth: u32,
) -> Result<MerkleProof, PrfsCryptoError> {
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
    nodes.push(leaves.to_vec());

    for d in 0..depth {
        println!("d: {}", d);

        let mut parent = vec![];
        let children = nodes.get(d).unwrap();

        if children.len() < 1 {
            return Err(format!("children is len 0, d: {}", d).into());
        }

        if children.len() == 1 {
            println!("A single children, d: {}", d);

            let left = children.get(0).unwrap();
            let right = left;

            let res = hash_two(left, &right).unwrap();
            parent.push(res);
            println!("parent: {:?}", parent);

            nodes.push(parent);

            continue;
        }

        for i in (0..children.len()).step_by(2) {
            println!("d: {}, i: {}", d, i);

            let left = match children.get(i) {
                Some(l) => l,
                None => break,
            };

            let right = children.get(i + 1);

            if let Some(r) = right {
                println!("l: {:?}, r: {:?}", left, r);

                let res = hash_two(left, r).unwrap();
                parent.push(res);
            } else {
                println!("l: {:?}, r: {:?}", left, left);
                let res = hash_two(left, left).unwrap();
                parent.push(res);

                break;
            }
        }

        println!("parent: {:?}", parent);
        nodes.push(parent);
    }

    let root = match nodes
        .get(depth)
        .expect(&format!("nodes at {} should exist", depth))
        .get(0)
    {
        Some(r) => r,
        None => return Err(format!("root does not exist, depth: {}", depth).into()),
    };

    for (h, n) in nodes.iter().enumerate() {
        println!("\nNodes h: {}, nodes ({}): {:?}", h, n.len(), n);
    }

    let sibling_path = make_sibling_path(depth as u32, leaf_idx);

    println!("sibling_path: {:?}", sibling_path);

    for (h, s_idx) in sibling_path.sibling_indices.iter().enumerate() {
        let nodes_at_height = nodes
            .get(h)
            .expect(&format!("sibling index should exist at depth, {}", h));

        let my_idx = if s_idx % 2 == 0 { s_idx + 1 } else { s_idx - 1 };

        let sibling = match nodes_at_height.get(*s_idx as usize) {
            Some(s) => s,
            None => nodes_at_height.get(my_idx as usize).expect(&format!(
                "Node in merkle path should exist, h: {}, my_idx: {}",
                h, my_idx
            )),
        };

        // siblings.push(sibling);
        println!("\nsibling: {:?}", sibling);
    }

    let p = MerkleProof {
        path_indices,
        root: root.to_vec(),
        siblings,
    };

    Ok(p)
}
