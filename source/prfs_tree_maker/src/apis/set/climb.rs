use super::json::SetJson;
use crate::TreeMakerError;
use colored::Colorize;
use prfs_db_interface::{
    db_apis,
    entities::{PrfsSet, PrfsTreeNode},
    sqlx::{Pool, Postgres, Transaction},
};
use rust_decimal::Decimal;
use std::time::SystemTime;

pub async fn create_tree_nodes(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    set_json: &SetJson,
    prfs_set: &mut PrfsSet,
) -> Result<String, TreeMakerError> {
    let set_label = set_json.set.label.to_string();
    let depth = set_json.set.tree_depth as usize;
    let set_id = set_json.set.set_id.to_string();

    println!(
        "{} tree nodes set label: {}, set_id: {}, depth: {}",
        "Creating".green(),
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

    let where_clause = format!("where set_id='{}' order by pos_w asc", set_id);

    let now = SystemTime::now();
    let leaves = db_apis::get_prfs_tree_nodes(pool, &where_clause).await?;

    let elapsed = now.elapsed().unwrap();
    println!(
        "Query took {} ms - get_prfs_tree_nodes, row_count: {}",
        elapsed.as_millis(),
        leaves.len(),
    );

    if leaves.len() < 1 {
        return Err(format!("Cannot climb if there is no leaf, set_id: {}", set_id).into());
    }

    require_last_leaf_have_correct_pos(&leaves);

    let mut children: Vec<[u8; 32]> = leaves
        .iter()
        .map(|leaf| {
            let b = prfs_crypto::convert_hex_into_32bytes(&leaf.val).unwrap();
            b
        })
        .collect();

    let mut count = 0;
    let mut parent_nodes = vec![];
    for d in 0..depth {
        println!("processing depth: {}", d);

        let now = SystemTime::now();

        let parent = match prfs_crypto::calc_parent_nodes(&children) {
            Ok(p) => p,
            Err(err) => return Err(format!("calc parent err: {}, d: {}", err, d).into()),
        };

        // println!("parent: {:?}", parent);

        parent_nodes = vec![];
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

        db_apis::insert_prfs_tree_nodes(tx, &parent_nodes, false).await?;
        children = parent;

        count += parent_nodes.len();

        let elapsed = now.elapsed().unwrap();
        println!(
            "Depth processing took {} ms - depth:{}, parent node count: {}",
            elapsed.as_millis(),
            d,
            parent_nodes.len(),
        );

        // break;
    }

    let merkle_root = parent_nodes[0].val.to_string();

    println!(
        "{} tree nodes, total count: {}, merkle_root: {:?}",
        "Created".green(),
        count,
        merkle_root,
    );

    prfs_set.merkle_root = merkle_root.to_string();
    db_apis::insert_prfs_set(tx, &prfs_set, true).await.unwrap();

    Ok(merkle_root)
}

fn require_last_leaf_have_correct_pos(leaves: &Vec<PrfsTreeNode>) {
    let last_leaf = leaves.last().unwrap();

    if last_leaf.pos_w != Decimal::from(leaves.len() - 1) {
        panic!(
            "last_leaf's pos_w is invalid, pos_w: {}, leaves_len: {}",
            last_leaf.pos_w,
            leaves.len()
        );
    }
}
