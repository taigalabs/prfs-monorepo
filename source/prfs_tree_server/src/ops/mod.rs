use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::{
    PrfsAtstGroup, PrfsAtstGroupId, PrfsAtstValue, PrfsSetElement, PrfsSetElementData,
    PrfsSetElementStatus, PrfsTree, PrfsTreeNode,
};
use prfs_tree_lib::apis2::tree;
use rust_decimal::Decimal;

use crate::PrfsTreeServerError;

const TREE_DEPTH: i16 = 32;
const FINITE_FIELD: &str = "Z_(2^256-2^32-977)";
const ELLIPTIC_CURVE: &str = "Secp256k1";
const LIMIT: i32 = 20;

const VALUE_IDX: usize = 0;

pub async fn _import_prfs_attestations_to_prfs_set(
    tx: &mut Transaction<'_, Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    dest_set_id: &String,
) -> Result<(String, u64), PrfsTreeServerError> {
    let _rows_deleted = prfs::delete_prfs_set_elements(tx, &dest_set_id).await?;

    let atsts =
        prfs::get_prfs_attestations_by_atst_group_id__tx(tx, &atst_group_id, 0, 50000).await?;

    if atsts.len() > 65536 {
        return Err("Currently we can produce upto 65536 items".into());
    }

    let mut prfs_set_elements = vec![];
    for (idx, atst) in atsts.iter().enumerate() {
        let value_at_idx = atst
            .value
            .0
            .get(VALUE_IDX)
            .ok_or_else(|| format!("Value should exist, atst: {:?}", atst))?;

        let data = PrfsSetElementData {
            commitment: atst.cm.to_string(),
            value_int: value_at_idx.value_int.to_string(),
            value_raw: value_at_idx.value_raw.to_string(),
        };

        let elem = PrfsSetElement {
            element_id: atst.label.to_string(),
            set_id: dest_set_id.to_string(),
            data: JsonType::from(data),
            element_idx: Decimal::from(idx),
            r#ref: None,
            status: PrfsSetElementStatus::NotRegistered,
        };

        prfs_set_elements.push(elem);
    }

    println!("a: {:?}", prfs_set_elements);

    let rows_affected = prfs::insert_atsts_as_prfs_set_elements(tx, prfs_set_elements)
        .await
        .map_err(|err| format!("Error inserting atsts as Prfs attestations, err: {}", err))?;

    return Ok((dest_set_id.to_string(), rows_affected));
}

pub async fn _create_prfs_tree_by_prfs_set(
    mut tx: &mut Transaction<'_, Postgres>,
    set_id: &String,
    tree_label: &String,
    tree_id: &String,
) -> Result<(PrfsTree, i64), PrfsTreeServerError> {
    let mut set = prfs::get_prfs_set_by_set_id__tx(tx, &set_id)
        .await
        .map_err(|err| format!("Error getting prfs set, set_id: {}, err: {}", set_id, err))?;

    let set_elements = prfs::get_prfs_set_elements__tx(tx, &set.set_id, 0, 50000)
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
