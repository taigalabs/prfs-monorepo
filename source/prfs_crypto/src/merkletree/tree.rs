use std::sync::Arc;

use super::merklepath::make_sibling_path;
use crate::{
    hash_two,
    hexutils::{convert_32bytes_into_decimal_string, convert_hex_into_32bytes},
    make_path_indices, PrfsCryptoError,
};
use primitive_types::U256;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};

pub const ZERO: [u8; 32] = [0u8; 32];

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MerkleProof {
    pub path_indices: Vec<u128>,
    pub root: String,
    pub siblings: Vec<String>,
}

pub fn make_merkle_proof(
    leaves: Vec<String>,
    leaf_idx: u128,
    depth: u8,
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

    let leaves: Vec<[u8; 32]> = leaves
        .iter()
        .enumerate()
        .map(|(idx, leaf)| {
            let b = convert_hex_into_32bytes(leaf).unwrap();
            println!("leaf, idx: {}, bytes: {:?}, leaf: {}", idx, b, leaf);

            b
        })
        .collect();

    let mut nodes: Vec<Vec<[u8; 32]>> = Vec::with_capacity(depth + 1);
    nodes.push(leaves.to_vec());

    for d in 0..depth {
        let children = nodes.get(d).unwrap();

        println!("depth: {}, children count: {}", d, children.len());

        let parent = match calc_parent_nodes(children) {
            Ok(p) => p,
            Err(err) => return Err(format!("calc parent err: {}, d: {}", err, d).into()),
        };

        // println!("parent: {:?}", parent);
        nodes.push(parent);
    }

    let root = match nodes
        .get(depth)
        .expect(&format!("nodes at {} should exist", depth))
        .get(0)
    {
        Some(r) => convert_32bytes_into_decimal_string(r)?,
        None => return Err(format!("root does not exist, depth: {}", depth).into()),
    };

    let sibling_indices = make_sibling_path(depth as u8, leaf_idx);
    let path_indices = make_path_indices(depth as u8, leaf_idx);

    println!("sibling_indices: {:?}", sibling_indices);

    let mut siblings = vec![];
    for (h, s_idx) in sibling_indices.iter().enumerate() {
        let nodes_at_height = nodes
            .get(h)
            .expect(&format!("sibling index should exist at depth, {}", h));

        /////////////////////////////////////
        // let my_idx = if s_idx % 2 == 0 { s_idx + 1 } else { s_idx - 1 };

        let sibling = match nodes_at_height.get(*s_idx as usize) {
            Some(s) => s,
            None => {
                // nodes_at_height.get(my_idx as usize).expect(&format!(
                // "Node in merkle path should exist, h: {}, my_idx: {}",
                // h, my_idx))

                &ZERO
            }
        };

        let s = convert_32bytes_into_decimal_string(sibling)?;
        // println!("\nsibling({}, {}): {:?}, decimal: {}", h, s_idx, sibling, s);

        siblings.push(s);
    }

    let p = MerkleProof {
        path_indices,
        root,
        siblings,
    };

    Ok(p)
}

pub fn calc_parent_nodes(children: &Vec<[u8; 32]>) -> Result<Vec<[u8; 32]>, PrfsCryptoError> {
    if children.len() < 1 {
        return Err(format!("children is len 0").into());
    }

    // single child
    if children.len() == 1 {
        let mut parent = vec![];
        let left = children.get(0).unwrap();
        let right = &ZERO;

        let res = hash_two(left, right).unwrap();
        parent.push(res);

        // let l = convert_32bytes_into_decimal_string(left)?;
        // let r = convert_32bytes_into_decimal_string(right)?;
        // let res = convert_32bytes_into_decimal_string(&res)?;
        // println!("l: {:?}, r: {:?}, res: {:?}", l, r, res);

        // continue;
        return Ok(parent);
    } else {
        let mut parent = Arc::new(std::sync::Mutex::new(vec![]));
        (0..children.len())
            .into_par_iter()
            .step_by(2)
            .for_each(|i| {
                let left = match children.get(i) {
                    Some(l) => l,
                    None => return,
                };

                let right = children.get(i + 1);

                if let Some(r) = right {
                    // left and right are both present
                    let res = hash_two(left, r).unwrap();
                    let mut parent_lock = parent.lock().unwrap();
                    parent_lock.push(res);

                    // let l = convert_32bytes_into_decimal_string(left)?;
                    // let r = convert_32bytes_into_decimal_string(r)?;
                    // let res = convert_32bytes_into_decimal_string(&res)?;
                    // println!("l: {:?}, r: {:?}, res: {:?}", l, r, res);
                } else {
                    let right = &ZERO;
                    // only left is present
                    let res = hash_two(left, right).unwrap();
                    let mut parent_lock = parent.lock().unwrap();
                    parent_lock.push(res);

                    // let l = convert_32bytes_into_decimal_string(left)?;
                    // let r = convert_32bytes_into_decimal_string(right)?;
                    // let res = convert_32bytes_into_decimal_string(&res)?;
                    // println!("l: {:?}, r: {:?}, res: {:?}", l, r, res);

                    return;
                }
            });

        return Ok(**parent);

        // for i in (0..children.len()).step_by(2) {
        //     // println!("i: {}", i);

        //     let left = match children.get(i) {
        //         Some(l) => l,
        //         None => break,
        //     };

        //     let right = children.get(i + 1);

        //     if let Some(r) = right {
        //         // left and right are both present
        //         let res = hash_two(left, r).unwrap();
        //         parent.push(res);

        //         // let l = convert_32bytes_into_decimal_string(left)?;
        //         // let r = convert_32bytes_into_decimal_string(r)?;
        //         // let res = convert_32bytes_into_decimal_string(&res)?;
        //         // println!("l: {:?}, r: {:?}, res: {:?}", l, r, res);
        //     } else {
        //         let right = &ZERO;
        //         // only left is present
        //         let res = hash_two(left, right).unwrap();
        //         parent.push(res);

        //         // let l = convert_32bytes_into_decimal_string(left)?;
        //         // let r = convert_32bytes_into_decimal_string(right)?;
        //         // let res = convert_32bytes_into_decimal_string(&res)?;
        //         // println!("l: {:?}, r: {:?}, res: {:?}", l, r, res);

        //         break;
        //     }
        // }
    }
}
