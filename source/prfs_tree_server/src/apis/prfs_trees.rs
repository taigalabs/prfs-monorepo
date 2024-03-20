use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::bail_out_tx;
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::{PrfsTree, PrfsTreeNode};
use prfs_entities::{
    CreatePrfsTreeByPrfsSetRequest, CreatePrfsTreeByPrfsSetResponse,
    GetLatestPrfsTreeBySetIdRequest, GetLatestPrfsTreeBySetIdResponse,
    UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeByNewAtstResponse,
};
use prfs_tree_api_error_codes::PRFS_TREE_API_ERROR_CODES;
use prfs_tree_lib::apis2::tree;
use rust_decimal::Decimal;
use std::sync::Arc;

use crate::ops::_import_prfs_attestations_to_prfs_set;

const TREE_DEPTH: i16 = 32;
const FINITE_FIELD: &str = "Z_(2^256-2^32-977)";
const ELLIPTIC_CURVE: &str = "Secp256k1";

pub async fn create_prfs_tree_by_prfs_set(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsTreeByPrfsSetRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<CreatePrfsTreeByPrfsSetResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = match pool.begin().await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error starting db transaction: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut set = match prfs::get_prfs_set_by_set_id(&pool, &input.set_id).await {
        Ok(s) => s,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                format!(
                    "Error getting prfs set, set_id: {}, err: {}",
                    input.set_id, err
                ),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let set_elements = match prfs::get_prfs_set_elements(&pool, &set.set_id, 0, 50000).await {
        Ok(e) => e,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                format!(
                    "Error getting prfs set elements, set_id: {}, err: {}",
                    set.set_id, err
                ),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut count = 0;
    let leaves = match tree::create_leaves(&set_elements) {
        Ok(l) => l,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                format!(
                    "Error creating leaves, set_id: {}, err: {}",
                    set.set_id, err
                ),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    let mut leaf_nodes = vec![];
    for (idx, leaf) in leaves.iter().enumerate() {
        let val = match prfs_crypto::convert_32bytes_le_into_decimal_string(&leaf) {
            Ok(v) => v,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                    format!(
                        "Error converting byets to string, val: {:?}, err: {}",
                        leaf, err
                    ),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

        let n = PrfsTreeNode {
            pos_w: set_elements[idx].element_idx,
            pos_h: 0,
            meta: None,
            val,
            tree_id: input.tree_id.to_string(),
            set_id: set.set_id.to_string(),
        };

        leaf_nodes.push(n);
    }

    if leaf_nodes.len() < 1 {
        let resp = ApiResponse::new_error(
            &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
            format!("No tree nodes to insert, leaf_nodes: {:?}", leaf_nodes,),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if let Err(err) = prfs::insert_prfs_tree_nodes(&mut tx, &leaf_nodes, false).await {
        let resp = ApiResponse::new_error(
            &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
            format!(
                "Error inserting prfs tree nodes, leaf_nodes: {:?}, err: {}",
                leaf_nodes, err
            ),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }
    count += leaves.len();

    let mut children = leaves;
    let mut parent_nodes = vec![];
    for d in 0..TREE_DEPTH {
        let parents = match tree::calc_parent_nodes(&children) {
            Ok(p) => p,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                    format!("Error calculating parent nodes, err: {}", err),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };
        // println!("d: {}, parents: {:?}", d, parents);

        parent_nodes = vec![];
        for (idx, p) in parents.iter().enumerate() {
            let val = prfs_crypto::convert_32bytes_le_into_decimal_string(&p).unwrap();

            let n = PrfsTreeNode {
                pos_w: Decimal::from(idx),
                pos_h: (d + 1) as i32,
                meta: None,
                val,
                tree_id: input.tree_id.to_string(),
                set_id: set.set_id.to_string(),
            };

            parent_nodes.push(n);
        }

        children = parents;
        if let Err(err) = prfs::insert_prfs_tree_nodes(&mut tx, &parent_nodes, false).await {
            let resp = ApiResponse::new_error(
                &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Error inserting tree nodes, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
        count += parent_nodes.len();
    }

    let merkle_root = parent_nodes[0].val.to_string();
    set.cardinality = count as i64;

    if let Err(err) = prfs::upsert_prfs_set(&mut tx, &set).await {
        let resp = ApiResponse::new_error(
            &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
            format!("Error upserting prfs set, err: {}", err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let tree = PrfsTree {
        label: input.tree_label.to_string(),
        tree_id: input.tree_id.to_string(),
        set_id: input.set_id.to_string(),
        merkle_root: merkle_root.to_string(),
        tree_depth: TREE_DEPTH,
        finite_field: FINITE_FIELD.to_string(),
        elliptic_curve: ELLIPTIC_CURVE.to_string(),
    };
    if let Err(err) = prfs::insert_prfs_tree(&mut tx, &tree).await {
        let resp = ApiResponse::new_error(
            &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
            format!("Error inserting prfs tree, err: {}", err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsTreeByPrfsSetResponse {
        tree_id: input.tree_id.to_string(),
        set_id: input.set_id.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_latest_prfs_tree_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetLatestPrfsTreeBySetIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetLatestPrfsTreeBySetIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_tree = prfs::get_latest_prfs_tree_by_set_id(pool, &input.set_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetLatestPrfsTreeBySetIdResponse { prfs_tree });
    return (StatusCode::OK, Json(resp));
}

pub async fn update_prfs_tree_by_new_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<UpdatePrfsTreeByNewAtstRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<UpdatePrfsTreeByNewAtstResponse>>,
) {
    let pool = &state.db2.pool;

    let prfs_sets = match prfs::get_prfs_sets_by_topic(pool, &input.atst_type.to_string()).await {
        Ok(s) => s,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut tx = bail_out_tx!(pool, &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR);

    for set in prfs_sets {
        match _import_prfs_attestations_to_prfs_set(
            &pool,
            &mut tx,
            &input.atst_type.to_string(),
            &set.set_id,
        )
        .await
        {
            Ok(_) => (),
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &PRFS_TREE_API_ERROR_CODES.UNKNOWN_ERROR,
                    err.to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        }
    }

    // println!("sets: {:?}", prfs_sets);
    // let prfs_circuit_drivers = prfs::get_prfs_circuit_drivers(&pool).await;

    let resp = ApiResponse::new_success(UpdatePrfsTreeByNewAtstResponse {
        prfs_set_ids: vec![],
    });
    return (StatusCode::OK, Json(resp));
}
