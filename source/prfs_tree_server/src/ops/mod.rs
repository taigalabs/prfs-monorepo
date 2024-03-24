use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::{PrfsAtstType, PrfsTree, PrfsTreeNode};
use prfs_tree_lib::apis2::tree;
use rust_decimal::Decimal;

use crate::PrfsTreeServerError;

const TREE_DEPTH: i16 = 32;
const FINITE_FIELD: &str = "Z_(2^256-2^32-977)";
const ELLIPTIC_CURVE: &str = "Secp256k1";
const LIMIT: i32 = 20;

pub async fn _import_prfs_attestations_to_prfs_set(
    pool: &Pool<Postgres>,
    tx: &mut Transaction<'_, Postgres>,
    atst_type: &PrfsAtstType,
    dest_set_id: &String,
) -> Result<(String, u64), PrfsTreeServerError> {
    let _rows_deleted = prfs::delete_prfs_set_elements(tx, &dest_set_id).await?;

    let atsts = prfs::get_prfs_attestations(&pool, &atst_type, 0, 50000).await?;

    if atsts.len() > 65536 {
        return Err("Currently we can produce upto 65536 items".into());
    }

    let rows_affected =
        prfs::insert_asset_atsts_as_prfs_set_elements(tx, atsts, &dest_set_id).await?;

    return Ok((dest_set_id.to_string(), rows_affected));
}

pub async fn _create_prfs_tree_by_prfs_set(
    pool: &Pool<Postgres>,
    mut tx: &mut Transaction<'_, Postgres>,
    set_id: &String,
    tree_label: &String,
    tree_id: &String,
) -> Result<(PrfsTree, i64), PrfsTreeServerError> {
    println!(
        "set_id: {}, tree_label: {}, tree_id: {}",
        set_id, tree_label, tree_id
    );

    let mut set = prfs::get_prfs_set_by_set_id(&pool, &set_id)
        .await
        .map_err(|err| format!("Error getting prfs set, set_id: {}, err: {}", set_id, err))?;

    let set_elements = prfs::get_prfs_set_elements(&pool, &set.set_id, 0, 50000)
        .await
        .map_err(|err| {
            format!(
                "Error getting prfs set elements, set_id: {}, err: {}",
                set_id, err
            )
        })?;

    let mut count = 0;
    // println!("set_elements: {:?}", set_elements);
    let leaves = tree::create_leaves(&set_elements).map_err(|err| {
        format!(
            "Error creating leaves, set_id: {}, err: {}",
            set.set_id, err
        )
    })?;

    let mut leaf_nodes = vec![];
    for (idx, leaf) in leaves.iter().enumerate() {
        let val = prfs_crypto::convert_32bytes_le_into_decimal_string(&leaf).map_err(|err| {
            format!(
                "Error converting byets to string, val: {:?}, err: {}",
                leaf, err
            )
        })?;

        let n = PrfsTreeNode {
            pos_w: set_elements[idx].element_idx,
            pos_h: 0,
            meta: None,
            val,
            tree_id: tree_id.to_string(),
            set_id: set_id.to_string(),
        };

        leaf_nodes.push(n);
    }

    if leaf_nodes.len() < 1 {
        return Err(format!("No tree nodes to insert, leaf_nodes: {:?}", leaf_nodes,).into());
    }

    if let Err(err) = prfs::insert_prfs_tree_nodes(&mut tx, &leaf_nodes, false).await {
        return Err(format!(
            "Error inserting prfs tree nodes, leaf_nodes: {:?}, err: {}",
            leaf_nodes, err
        )
        .into());
    }
    count += leaves.len();

    let leaves_count: u64 = leaves.len().try_into()?;
    let mut children = leaves;
    let mut parent_nodes = vec![];
    for d in 0..TREE_DEPTH {
        let parents = tree::calc_parent_nodes(&children)
            .map_err(|err| format!("Error calculating parent nodes, err: {}", err))?;

        parent_nodes = vec![];
        for (idx, p) in parents.iter().enumerate() {
            let val = prfs_crypto::convert_32bytes_le_into_decimal_string(&p).unwrap();

            let n = PrfsTreeNode {
                pos_w: Decimal::from(idx),
                pos_h: (d + 1) as i32,
                meta: None,
                val,
                tree_id: tree_id.to_string(),
                set_id: set_id.to_string(),
            };

            parent_nodes.push(n);
        }

        children = parents;
        prfs::insert_prfs_tree_nodes(&mut tx, &parent_nodes, false)
            .await
            .map_err(|err| format!("Error inserting tree nodes, err: {}", err))?;
        count += parent_nodes.len();
    }

    let merkle_root = parent_nodes[0].val.to_string();
    set.cardinality = count as i64;

    prfs::upsert_prfs_set(&mut tx, &set)
        .await
        .map_err(|err| format!("Error upserting prfs set, err: {}", err))?;

    let tree = PrfsTree {
        label: tree_label.to_string(),
        tree_id: tree_id.to_string(),
        set_id: set_id.to_string(),
        merkle_root: merkle_root.to_string(),
        tree_depth: TREE_DEPTH,
        finite_field: FINITE_FIELD.to_string(),
        elliptic_curve: ELLIPTIC_CURVE.to_string(),
    };

    prfs::insert_prfs_tree(&mut tx, &tree)
        .await
        .map_err(|err| format!("Error inserting prfs tree, err: {}", err))?;

    Ok((tree, set.cardinality))
}
