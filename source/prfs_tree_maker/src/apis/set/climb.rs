use super::json::SetJson;
use crate::TreeMakerError;
use colored::Colorize;
use prfs_db_interface::{database::Database, models::PrfsTreeNode};
use rust_decimal::Decimal;
use std::time::SystemTime;

pub async fn create_tree_nodes(db: &Database, set_json: &SetJson) -> Result<(), TreeMakerError> {
    let set_label = set_json.set.label.to_string();
    let depth = set_json.set.tree_depth as usize;
    let set_id = set_json.set.set_id.to_string();

    println!(
        "{} creating tree nodes set label: {}, set_id: {}, depth: {}",
        "Star".green(),
        set_label,
        set_id,
        depth,
    );

    if depth < 2 {
        return Err(format!(
            "Cannot create tree if depth is less than 2, set_id: {}",
            set_id,
        )
        .into());
    }

    let where_clause = format!("set_id='{}' order by pos_w asc", set_id);

    let now = SystemTime::now();
    let leaves = db.get_prfs_tree_nodes(&where_clause).await?;
    let elapsed = now.elapsed().unwrap();

    println!(
        "Query took {} ms - get_prfs_tree_nodes, row_count: {}",
        elapsed.as_millis(),
        leaves.len(),
    );

    if leaves.len() < 1 {
        return Err(format!("Cannot climb if there is no leaf, set_id: {}", set_id).into());
    }

    let _ = check_if_last_leaf_has_correct_pos(&leaves);

    let leaves: Vec<[u8; 32]> = leaves
        .iter()
        .map(|leaf| {
            let b = prfs_crypto::convert_hex_into_32bytes(&leaf.val).unwrap();
            b
        })
        .collect();

    let mut children = leaves;

    for d in 0..depth {
        let parent = match prfs_crypto::calc_parent_nodes(&children) {
            Ok(p) => p,
            Err(err) => return Err(format!("calc parent err: {}, d: {}", err, d).into()),
        };

        // println!("parent: {:?}", parent);

        let mut parent_nodes = vec![];
        for (idx, node) in parent.iter().enumerate() {
            // println!("node: {:?}, idx: {}", node, idx);
            let val = prfs_crypto::convert_32bytes_into_decimal_string(node).unwrap();

            let n = PrfsTreeNode {
                pos_w: Decimal::from(idx),
                pos_h: (d + 1) as i32,
                val,
                set_id: set_id.to_string(),
            };

            parent_nodes.push(n);
        }

        println!("depth: {}, parent_nodes len: {:?}", d, parent_nodes.len());

        db.insert_prfs_tree_nodes(&parent_nodes, false).await?;
        children = parent;
        // break;
    }

    Ok(())
}

fn check_if_last_leaf_has_correct_pos(leaves: &Vec<PrfsTreeNode>) -> bool {
    let last_leaf = leaves.last().unwrap();

    println!("pos_w: {}, leaves_len: {}", last_leaf.pos_w, leaves.len());

    return true;
}
