use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
    GetPrfsSetBySetIdResponse, GetPrfsSetsBySetTypeRequest, GetPrfsSetsRequest,
    GetPrfsSetsResponse,
};
use std::sync::Arc;

pub async fn get_prfs_sets(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetsResponse>>) {
    let pool = &state.db2.pool;
    let prfs_sets = prfs::get_prfs_sets(pool, input.page_idx, input.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: input.page_idx,
        page_size: input.page_size,
        prfs_sets,
    });

    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_sets_by_set_type(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetsBySetTypeRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetsResponse>>) {
    let pool = &state.db2.pool;
    let prfs_sets =
        prfs::get_prfs_sets_by_set_type(pool, input.set_type, input.page_idx, input.page_size)
            .await
            .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: input.page_idx,
        page_size: input.page_size,
        prfs_sets,
    });

    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_by_set_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetBySetIdRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetBySetIdResponse>>) {
    let pool = &state.db2.pool;
    let prfs_set = prfs::get_prfs_set_by_set_id(pool, &input.set_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetBySetIdResponse { prfs_set });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_set(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsSetRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsSetResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = match pool.begin().await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error starting db transaction: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let set_id = prfs::insert_prfs_set_ins1(&mut tx, &input.prfs_set_ins1)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(CreatePrfsSetResponse { set_id });

    tx.commit().await.unwrap();

    return (StatusCode::OK, Json(resp));
}

// pub async fn create_prfs_dynamic_set_element(
//     req: Request<Incoming>,
//     state: Arc<ServerState>,
// ) -> ApiHandlerResult {
//     let req: CreatePrfsDynamicSetElementRequest = parse_req(req).await;
//     let pool = &state.db2.pool;
//     let mut tx = pool.begin().await.unwrap();

//     let largest_pos_w = prfs::get_largest_pos_w_tree_leaf_node(&pool, &req.set_id)
//         .await
//         .unwrap();

//     let pos_w = if let Some(pos_w) = largest_pos_w {
//         pos_w + Decimal::from(1)
//     } else {
//         Decimal::from(0)
//     };

//     let node = PrfsTreeNode {
//         pos_w,
//         pos_h: 0,
//         val: req.val.to_string(),
//         meta: Some(req.meta),
//         set_id: req.set_id,
//     };

//     let pos_w = prfs::insert_prfs_tree_node(&mut tx, &node).await.unwrap();

//     tx.commit().await.unwrap();

//     let resp = ApiResponse::new_success(CreatePrfsDynamicSetElementResponse { pos_w });

//     return Ok(resp.into_hyper_response());
// }

// pub async fn compute_prfs_set_merkle_root(
//     req: Request<Incoming>,
//     state: Arc<ServerState>,
// ) -> ApiHandlerResult {
//     let req: ComputePrfsSetMerkleRootRequest = parse_req(req).await;
//     let pool = &state.db2.pool;
//     let mut tx = pool.begin().await.unwrap();

//     let required_policy = String::from("COMPUTE_MERKLE_ROOT");

//     let prfs_account = prfs::get_prfs_account_by_account_id(pool, &req.account_id)
//         .await
//         .unwrap();

//     println!("prfs_account: {:?}", prfs_account);

//     if !prfs_account.policy_ids.contains(&required_policy) {
//         return Err(ApiHandleError::from(
//             &API_ERROR_CODES.NO_POLICY_ATTACHED,
//             required_policy.into(),
//         ));
//     }

//     let mut prfs_set = prfs::get_prfs_set_by_set_id(pool, &req.set_id)
//         .await
//         .unwrap();

//     let deleted_row_count = prfs::delete_prfs_non_leaf_nodes_by_set_id(&mut tx, &req.set_id)
//         .await
//         .unwrap();

//     println!(
//         "Deleted non leaf nodes, count: {}, set_id: {}",
//         deleted_row_count, &req.set_id
//     );

//     let leaf_nodes = prfs::get_prfs_tree_leaf_nodes_by_set_id(pool, &req.set_id, 0, 60000)
//         .await
//         .unwrap();

//     let merkle_root = tree_maker_apis::create_tree_nodes(&mut tx, &mut prfs_set, &leaf_nodes)
//         .await
//         .unwrap();

//     tx.commit().await.unwrap();

//     let resp = ApiResponse::new_success(ComputePrfsSetMerkleRootResponse {
//         set_id: req.set_id,
//         merkle_root,
//     });

//     return Ok(resp.into_hyper_response());
// }
