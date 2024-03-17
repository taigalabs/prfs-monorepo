use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
    GetPrfsSetBySetIdResponse, GetPrfsSetsRequest, GetPrfsSetsResponse,
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
