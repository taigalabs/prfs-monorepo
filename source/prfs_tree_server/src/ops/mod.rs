use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit, resp::ApiResponse, ApiHandleError};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::{
    postgres::any::AnyConnectionBackend, Acquire, Pool, Postgres, Transaction,
};
use prfs_db_interface::prfs;
use prfs_entities::{
    ComputeCryptoAssetSizeTotalValuesRequest, PrfsAtstType, PrfsTree, PrfsTreeNode,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use prfs_tree_lib::apis2::tree;
use rust_decimal::Decimal;
use std::sync::Arc;

use crate::{envs::ENVS, PrfsTreeServerError};

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
) -> Result<(String, u64), PrfsTreeServerError> {
    let mut set = prfs::get_prfs_set_by_set_id(&pool, &set_id).await?;
    //     {
    //     Ok(s) => s,
    //     Err(err) => {
    //         let resp = ApiResponse::new_error(
    //             &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
    //             format!(
    //                 "Error getting prfs set, set_id: {}, err: {}",
    //                 input.set_id, err
    //             ),
    //         );
    //         return (StatusCode::BAD_REQUEST, Json(resp));
    //     }
    // };

    let set_elements = prfs::get_prfs_set_elements(&pool, &set.set_id, 0, 50000).await?;
    // {
    //     Ok(e) => e,
    //     Err(err) => {
    //         let resp = ApiResponse::new_error(
    //             &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
    //             format!(
    //                 "Error getting prfs set elements, set_id: {}, err: {}",
    //                 set.set_id, err
    //             ),
    //         );
    //         return (StatusCode::BAD_REQUEST, Json(resp));
    //     }
    // };

    let mut count = 0;
    let leaves = tree::create_leaves(&set_elements)?;
    // {
    //     Ok(l) => l,
    //     Err(err) => {
    //         let resp = ApiResponse::new_error(
    //             &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
    //             format!(
    //                 "Error creating leaves, set_id: {}, err: {}",
    //                 set.set_id, err
    //             ),
    //         );
    //         return (StatusCode::BAD_REQUEST, Json(resp));
    //     }
    // };
    let mut leaf_nodes = vec![];
    for (idx, leaf) in leaves.iter().enumerate() {
        let val = prfs_crypto::convert_32bytes_le_into_decimal_string(&leaf)?;
        //     {
        //     Ok(v) => v,
        //     Err(err) => {
        //         let resp = ApiResponse::new_error(
        //             &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
        //             format!(
        //                 "Error converting byets to string, val: {:?}, err: {}",
        //                 leaf, err
        //             ),
        //         );
        //         return (StatusCode::BAD_REQUEST, Json(resp));
        //     }
        // };

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
        let parents = tree::calc_parent_nodes(&children)?;
        // {
        //     Ok(p) => p,
        //     Err(err) => {
        //         let resp = ApiResponse::new_error(
        //             &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
        //             format!("Error calculating parent nodes, err: {}", err),
        //         );
        //         return (StatusCode::BAD_REQUEST, Json(resp));
        //     }
        // };
        // println!("d: {}, parents: {:?}", d, parents);

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
        prfs::insert_prfs_tree_nodes(&mut tx, &parent_nodes, false).await?;
        // {
        //     let resp = ApiResponse::new_error(
        //         &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
        //         format!("Error inserting tree nodes, err: {}", err),
        //     );
        //     return (StatusCode::BAD_REQUEST, Json(resp));
        // }
        count += parent_nodes.len();
    }

    let merkle_root = parent_nodes[0].val.to_string();
    set.cardinality = count as i64;

    prfs::upsert_prfs_set(&mut tx, &set).await?;
    // {
    //     let resp = ApiResponse::new_error(
    //         &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
    //         format!("Error upserting prfs set, err: {}", err),
    //     );
    //     return (StatusCode::BAD_REQUEST, Json(resp));
    // }

    let tree = PrfsTree {
        label: tree_label.to_string(),
        tree_id: tree_id.to_string(),
        set_id: set_id.to_string(),
        merkle_root: merkle_root.to_string(),
        tree_depth: TREE_DEPTH,
        finite_field: FINITE_FIELD.to_string(),
        elliptic_curve: ELLIPTIC_CURVE.to_string(),
    };

    prfs::insert_prfs_tree(&mut tx, &tree).await?;
    // {
    //     let resp = ApiResponse::new_error(
    //         &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
    //         format!("Error inserting prfs tree, err: {}", err),
    //     );
    //     return (StatusCode::BAD_REQUEST, Json(resp));
    // }

    Ok((tree.tree_id.to_string(), leaves_count))
}
