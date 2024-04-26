use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    GetPrfsAtstGroupsRequest, GetPrfsAtstGroupsResponse, PrfsAtstGroupMemberStatus,
    ValidateGroupMembershipRequest, ValidateGroupMembershipResponse,
};
use std::sync::Arc;

const LIMIT: i32 = 20;

pub async fn get_prfs_atst_groups(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsAtstGroupsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsAtstGroupsResponse>>) {
    let pool = &state.db2.pool;

    let rows = match prfs::get_prfs_atst_groups(&pool, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsAtstGroupsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn validate_group_membership(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ValidateGroupMembershipRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<ValidateGroupMembershipResponse>>,
) {
    let pool = &state.db2.pool;

    let member =
        match prfs::get_prfs_atst_group_member(&pool, &input.atst_group_id, &input.member_code)
            .await
        {
            Ok(r) => r,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &PRFS_ATST_API_ERROR_CODES.MEMBER_INFO_NOT_FOUND,
                    err.to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    // Only equality check for now
    if member.member_code != input.member_code {
        let resp = ApiResponse::new_error(
            &PRFS_ATST_API_ERROR_CODES.MEMBER_INFO_NOT_FOUND,
            "Member Code is not correct".to_string(),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    } else if member.status != PrfsAtstGroupMemberStatus::NotRegistered {
        let resp = ApiResponse::new_error(
            &PRFS_ATST_API_ERROR_CODES.MEMBER_ALREADY_REGISTERED,
            format!("Member code: {}", input.member_code),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    } else {
        let resp = ApiResponse::new_success(ValidateGroupMembershipResponse {
            is_valid: true,
            member_id: member.member_id,
            error: None,
        });
        return (StatusCode::OK, Json(resp));
    };
}
