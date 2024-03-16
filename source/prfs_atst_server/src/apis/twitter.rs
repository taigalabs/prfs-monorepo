use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::atst_api::{
    AttestTwitterAccRequest, AttestTwitterAccResponse, GetTwitterAccAtstRequest,
    GetTwitterAccAtstResponse, GetTwitterAccAtstsRequest, GetTwitterAccAtstsResponse,
    ValidateTwitterAccRequest, ValidateTwitterAccResponse,
};
use prfs_entities::atst_entities::{PrfsAccAtst, PrfsAtstStatus};
use prfs_web_scraper::destinations::twitter;
use std::sync::Arc;

const LIMIT: i32 = 20;

pub async fn validate_twitter_acc(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ValidateTwitterAccRequest>,
) -> (StatusCode, Json<ApiResponse<ValidateTwitterAccResponse>>) {
    let validation = twitter::scrape_tweet(&input.tweet_url, &input.twitter_handle)
        .await
        .map_err(|err| {
            ApiHandleError::from(&PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_VALIDATE_FAIL, err)
        })
        .unwrap();

    let resp = ApiResponse::new_success(ValidateTwitterAccResponse {
        is_valid: true,
        validation,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn attest_twitter_acc(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<AttestTwitterAccRequest>,
) -> (StatusCode, Json<ApiResponse<AttestTwitterAccResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_acc_atst = PrfsAccAtst {
        acc_atst_id: input.acc_atst_id,
        atst_type: input.validation.atst_type,
        dest: input.validation.dest,
        account_id: input.validation.account_id,
        cm: input.validation.cm,
        username: input.validation.username,
        avatar_url: input.validation.avatar_url,
        document_url: input.validation.document_url,
        status: PrfsAtstStatus::Valid,
    };

    let acc_atst_id = prfs::insert_prfs_acc_atst(&mut tx, &prfs_acc_atst)
        .await
        .map_err(|err| {
            ApiHandleError::from(&PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_ATST_INSERT_FAIL, err)
        })
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(AttestTwitterAccResponse {
        is_valid: true,
        acc_atst_id,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_twitter_acc_atsts(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetTwitterAccAtstsRequest>,
) -> (StatusCode, Json<ApiResponse<GetTwitterAccAtstsResponse>>) {
    let pool = &state.db2.pool;

    let rows = prfs::get_prfs_acc_atsts(&pool, input.offset, LIMIT)
        .await
        .map_err(|err| {
            ApiHandleError::from(&PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_ATST_INSERT_FAIL, err)
        })
        .unwrap();

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetTwitterAccAtstsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_twitter_acc_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetTwitterAccAtstRequest>,
) -> (StatusCode, Json<ApiResponse<GetTwitterAccAtstResponse>>) {
    let pool = &state.db2.pool;

    let prfs_acc_atst = prfs::get_prfs_acc_atst(&pool, &input.acc_atst_id)
        .await
        .map_err(|err| {
            ApiHandleError::from(&PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_ATST_INSERT_FAIL, err)
        })
        .unwrap();

    let resp = ApiResponse::new_success(GetTwitterAccAtstResponse { prfs_acc_atst });
    return (StatusCode::OK, Json(resp));
}
