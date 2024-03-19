use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    AddPrfsIndexRequest, AddPrfsIndexResponse, GetLeastRecentPrfsIndexRequest,
    GetLeastRecentPrfsIndexResponse, GetPrfsIndicesRequest, GetPrfsIndicesResponse,
};
use std::{collections::HashMap, sync::Arc};

// const LIMIT: i32 = 10;

pub async fn get_least_recent_prfs_index(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetLeastRecentPrfsIndexRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetLeastRecentPrfsIndexResponse>>,
) {
    let pool = &state.db2.pool;

    let prfs_indices = match prfs::get_least_recent_prfs_index(pool, &input.prfs_indices).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("error getting least recent prfs index: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut free_idx = String::new();
    // Trial 1: Get any row that does not exist (free slot)
    for idx in prfs_indices.iter() {
        if let None = idx.key {
            free_idx = idx.key2.to_string();
            break;
        }
    }

    // Trial 2: Get the oldest slot
    if free_idx.len() == 0 {
        let _free_idx = match prfs_indices.get(0) {
            Some(i) => i,
            None => {
                let resp = ApiResponse::new_error(
                    &PRFS_API_ERROR_CODES.UNKNOWN_ERROR,
                    "free_index does not exist".to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };
        free_idx = _free_idx.key2.to_string();
    }

    let resp = ApiResponse::new_success(GetLeastRecentPrfsIndexResponse {
        prfs_index: free_idx,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_indices(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsIndicesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsIndicesResponse>>) {
    let pool = &state.db2.pool;

    let prfs_indices = prfs::get_prfs_indices(pool, &input.keys).await.unwrap();

    let mut map = HashMap::new();
    for idx in prfs_indices {
        map.insert(idx.key.to_string(), idx.value.to_string());
    }

    let resp = ApiResponse::new_success(GetPrfsIndicesResponse { prfs_indices: map });
    return (StatusCode::OK, Json(resp));
}

pub async fn add_prfs_index(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<AddPrfsIndexRequest>,
) -> (StatusCode, Json<ApiResponse<AddPrfsIndexResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let _wallet_prfs_idx =
        prfs::upsert_prfs_index(&mut tx, &input.key, &input.value, &input.serial_no)
            .await
            .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(AddPrfsIndexResponse {
        key: input.key.to_string(),
    });
    return (StatusCode::OK, Json(resp));
}
