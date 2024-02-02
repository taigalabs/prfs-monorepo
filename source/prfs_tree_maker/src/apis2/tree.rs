use prfs_crypto::{
    crypto_bigint::{Encoding, U256},
    hex, poseidon_2, ZERO_NODE,
};
use prfs_entities::entities::{
    PrfsSet, PrfsSetElement, PrfsSetElementDataType, PrfsTreeNode, RawPrfsTreeNode,
};
use std::u128;

use crate::TreeMakerError;

pub fn create_leaves(set_elements: &Vec<PrfsSetElement>) -> Result<Vec<[u8; 32]>, TreeMakerError> {
    let mut nodes = vec![];
    for (_, elem) in set_elements.iter().enumerate() {
        let data = &elem.data;
        let mut args = [ZERO_NODE, ZERO_NODE];

        if data.len() > 2 {
            return Err("data of length over two is currently not available".into());
        }

        for (idx, d) in data.iter().enumerate() {
            match d.r#type {
                PrfsSetElementDataType::WalletCm => {
                    let val = if d.val.starts_with("0x") {
                        &d.val[2..]
                    } else {
                        &d.val
                    };
                    let u = U256::from_be_hex(&val);
                    let bytes = u.to_be_bytes();
                    args[idx] = bytes;
                }
                PrfsSetElementDataType::Int => {
                    let int128 = d.val.parse::<u128>().unwrap();
                    let u = U256::from_u128(int128);
                    let bytes = u.to_be_bytes();
                    args[idx] = bytes;
                }
            };
        }

        println!("args: {:?}, elem: {:?}", args, elem);
        let val = poseidon_2(&args[0], &args[1]).unwrap();
        let val2 = U256::from_be_bytes(val);
        println!("val: {:?}, val2: {:?}", val, val2);

        // let node = RawPrfsTreeNode {
        //     pos_w: elem.element_idx,
        //     pos_h: 0,
        //     meta: None,
        //     val,
        //     set_id: elem.set_id.to_string(),
        // };

        nodes.push(val);
    }

    return Ok(nodes);
}

pub fn calc_parent_nodes(
    // prfs_set: &PrfsSet,
    children: &Vec<[u8; 32]>,
) -> Result<Vec<[u8; 32]>, TreeMakerError> {
    // let set_label = prfs_set.label.to_string();
    // let depth = prfs_set.tree_depth as usize;
    // let set_id = &prfs_set.set_id;

    // if depth < 2 {
    //     return Err(format!(
    //         "Cannot create tree if depth is less than 2, set_id: {}",
    //         set_id,
    //     )
    //     .into());
    // }

    if children.len() < 1 {
        return Err(format!("Cannot climb if there is no children ").into());
    }

    // let children: Vec<[u8; 32]> = children
    //     .iter()
    //     .map(|child| {
    //         let b = prfs_crypto::convert_hex_into_32bytes(&child).unwrap();
    //         b
    //     })
    //     .collect();

    // let mut count = 0;
    // let mut parent_nodes = vec![];
    // for d in 0..depth {
    // println!("processing depth: {}, children len: {}", d, children.len());

    let parents = match prfs_crypto::calc_parent_nodes(&children) {
        Ok(p) => p,
        Err(err) => return Err(format!("calc parent err: {}", err).into()),
    };

    // println!("Finished processing parent, len: {}", parent.len());

    // parent_nodes = vec![];
    // for (_, node) in parents.into_iter().enumerate() {
    //     // println!("node: {:?}, idx: {}", node, idx);
    //     // let val = prfs_crypto::convert_32bytes_into_decimal_string(node).unwrap();

    //     // let n = PrfsTreeNode {
    //     //     pos_w: Decimal::from(idx),
    //     //     pos_h: (d + 1) as i32,
    //     //     meta: None,
    //     //     val,
    //     //     set_id: set_id.to_string(),
    //     // };

    //     parent_nodes.push(node);
    // }

    // println!(
    //     "{} parent nodes, d: {}, parent_nodes len: {}",
    //     "Inserting".green(),
    //     d,
    //     parent_nodes.len()
    // );

    // let parent_node_chunks: Vec<_> = parent_nodes.chunks(1000).collect();

    // let mut total_count = 0;
    //     for chunk in parent_node_chunks {
    //         // let updated_count = prfs::insert_prfs_tree_nodes(tx, chunk, false).await?;
    //         // total_count += updated_count;

    //         // println!(
    //         //     "{} parent_nodes, d: {}, updated_count: {}, total_count: {}",
    //         //     "Inserted".green(),
    //         //     d,
    //         //     updated_count,
    //         //     total_count,
    //         // );
    // }

    //     // db_apis::insert_prfs_tree_nodes(tx, &parent_nodes, false).await?;
    //     children = parent;

    //     count += parent_nodes.len();
    // }

    // let merkle_root = parent_nodes[0].val.to_string();

    // println!(
    //     "{} tree nodes, total count: {}, merkle_root: {:?}",
    //     "Created".green(),
    //     count,
    //     merkle_root,
    // );

    // prfs_set.merkle_root = merkle_root.to_string();
    // // prfs::upsert_prfs_set(tx, &prfs_set).await.unwrap();

    return Ok(parents);
}
