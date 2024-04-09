use prfs_api_rs::api::update_prfs_tree_by_new_atst;
use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_crypto::{convert_str_into_keccak_u256, hex};
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::atst_entities::{PrfsAtstStatus, PrfsAttestation};
use prfs_entities::{
    CreateGroupMemberAtstRequest, CreatePrfsAttestationResponse, GroupMemberAtstMeta,
    PrfsAtstGroupMemberStatus, PrfsAtstMeta, PrfsAtstVersion, UpdatePrfsTreeByNewAtstRequest,
};
use rust_decimal::Decimal;
use std::sync::Arc;

use crate::envs::ENVS;

pub async fn create_group_member_atst(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateGroupMemberAtstRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsAttestationResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    let mut member = match prfs::get_prfs_atst_group_member__tx(
        &mut tx,
        &input.atst_group_id,
        &input.member_code,
    )
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
    }

    let (value_num, value_raw) = if let PrfsAtstMeta::group_member(m) = &member.meta.0 {
        let num = convert_str_into_keccak_u256(&m.value_raw);

        (num.to_string(), m.value_raw.to_string())
    } else {
        (Decimal::from(0).to_string(), "".into())
    };

    let prfs_attestation = PrfsAttestation {
        atst_id: input.atst_id,
        atst_group_id: input.atst_group_id.clone(),
        label: input.label.to_string(),
        cm: input.cm,
        meta: member.meta.clone(),
        status: PrfsAtstStatus::Valid,
        value_num,
        value_raw,
        atst_version: PrfsAtstVersion::v0_2,
    };

    member.status = PrfsAtstGroupMemberStatus::Registered;
    match prfs::upsert_prfs_atst_group_members(&mut tx, &vec![member]).await {
        Ok(_) => (),
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let atst_id = match prfs::insert_prfs_attestation(&mut tx, &prfs_attestation).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &PRFS_ATST_API_ERROR_CODES.TWITTER_ACC_ATST_INSERT_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let _ = match update_prfs_tree_by_new_atst(
        &ENVS.prfs_api_server_endpoint,
        &UpdatePrfsTreeByNewAtstRequest {
            atst_group_id: input.atst_group_id,
        },
    )
    .await
    {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsAttestationResponse {
        is_valid: true,
        atst_id,
    });
    return (StatusCode::OK, Json(resp));
}
