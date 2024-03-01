use axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::{PrfsTree, PrfsTreeNode},
    prfs_api::{
        CreatePrfsTreeByPrfsSetRequest, CreatePrfsTreeByPrfsSetResponse,
        GetLatestPrfsTreeBySetIdRequest, GetLatestPrfsTreeBySetIdResponse,
    },
};
use prfs_tree_maker::apis2::tree;
use rust_decimal::Decimal;
use std::sync::Arc;

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
    let mut tx = pool.begin().await.unwrap();

    let mut set = prfs::get_prfs_set_by_set_id(&pool, &input.set_id)
        .await
        .unwrap();

    let set_elements = prfs::get_prfs_set_elements(&pool, &set.set_id, 0, 50000)
        .await
        .unwrap();

    let mut count = 0;
    let leaves = tree::create_leaves(&set_elements).unwrap();
    let mut leaf_nodes = vec![];
    for (idx, leaf) in leaves.iter().enumerate() {
        let val = prfs_crypto::convert_32bytes_le_into_decimal_string(&leaf).unwrap();

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

    prfs::insert_prfs_tree_nodes(&mut tx, &leaf_nodes, false)
        .await
        .unwrap();
    count += leaves.len();

    let mut children = leaves;
    let mut parent_nodes = vec![];
    for d in 0..TREE_DEPTH {
        let parents = tree::calc_parent_nodes(&children).unwrap();
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
        prfs::insert_prfs_tree_nodes(&mut tx, &parent_nodes, false)
            .await
            .unwrap();
        count += parent_nodes.len();
    }

    let merkle_root = parent_nodes[0].val.to_string();
    set.cardinality = count as i64;
    prfs::upsert_prfs_set(&mut tx, &set).await.unwrap();

    let tree = PrfsTree {
        label: input.tree_label.to_string(),
        tree_id: input.tree_id.to_string(),
        set_id: input.set_id.to_string(),
        merkle_root: merkle_root.to_string(),
        tree_depth: TREE_DEPTH,
        finite_field: FINITE_FIELD.to_string(),
        elliptic_curve: ELLIPTIC_CURVE.to_string(),
    };
    prfs::insert_prfs_tree(&mut tx, &tree).await.unwrap();

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
