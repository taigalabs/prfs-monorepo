use crate::{
    merklepath::{make_sibling_path, SiblingPath},
    MerkleTreeError,
};
use poseidon::poseidon_k256::{hash_from_bytes, hash_two};
use serde::{Deserialize, Serialize};

// pub struct MerkleTree {}

// impl MerkleTree {
//     pub fn a() {}
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct MerkleProof {
    pub path_indices: Vec<u8>,
    pub root: Vec<u8>,
    pub siblings: Vec<String>,
}

// const ZERO: [u8; 32] = [0u8; 32];

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
    nodes.push(leaves.to_vec());

    for d in 0..depth + 1 {
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

    // for (h, s_idx) in sibling_path.sibling_indices.iter().enumerate() {
    //     let node = nodes
    //         .get(h)
    //         .expect(&format!("sibling index should exist at depth, {}", h))
    //         .get(*s_idx as usize)
    //         .expect(&format!(
    //             "sibling index should exist, h: {}, idx: {}",
    //             h, s_idx
    //         ));

    //     println!("node: {:?}", node);
    // }

    let p = MerkleProof {
        path_indices,
        root: root.to_vec(),
        siblings,
    };

    Ok(p)
}
