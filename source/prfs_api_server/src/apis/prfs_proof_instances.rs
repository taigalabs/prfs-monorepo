use ethers_signers::Signer;
use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsProofInstance;
use prfs_entities::prfs_api::{
    CreatePrfsProofInstanceRequest, CreatePrfsProofInstanceResponse,
    GetPrfsProofInstanceByInstanceIdRequest, GetPrfsProofInstanceByInstanceIdResponse,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstanceByShortIdResponse,
    GetPrfsProofInstancesRequest, GetPrfsProofInstancesResponse,
};
use std::sync::Arc;

pub async fn get_prfs_proof_instances(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofInstancesRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsProofInstancesResponse>>) {
    let pool = &state.db2.pool;
    let (prfs_proof_instances_syn1, table_row_count) =
        match prfs::get_prfs_proof_instances_syn1(pool, input.page_idx, input.page_size).await {
            Ok(r) => r,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    let resp = ApiResponse::new_success(GetPrfsProofInstancesResponse {
        page_idx: input.page_idx,
        table_row_count,
        prfs_proof_instances_syn1,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_proof_instance_by_instance_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofInstanceByInstanceIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsProofInstanceByInstanceIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_proof_instance_syn1 =
        match prfs::get_prfs_proof_instance_syn1_by_instance_id(pool, &input.proof_instance_id)
            .await
        {
            Ok(p) => p,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    let resp = ApiResponse::new_success(GetPrfsProofInstanceByInstanceIdResponse {
        prfs_proof_instance_syn1,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_proof_instance_by_short_id(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsProofInstanceByShortIdRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<GetPrfsProofInstanceByShortIdResponse>>,
) {
    let pool = &state.db2.pool;
    let prfs_proof_instance = match prfs::get_prfs_proof_instance_by_short_id(pool, &input.short_id)
        .await
    {
        Ok(p) => p,
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let resp = ApiResponse::new_success(GetPrfsProofInstanceByShortIdResponse {
        prfs_proof_instance,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_prfs_proof_instance(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofInstanceRequest>,
) -> (
    StatusCode,
    Json<ApiResponse<CreatePrfsProofInstanceResponse>>,
) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let proof_instance_id_bytes = input.proof_instance_id.as_bytes();
    let short_id = &base_62::encode(proof_instance_id_bytes)[..8];

    let partial_proof = input.proof[..10]
        .iter()
        .map(|n| n.to_string())
        .collect::<String>();

    let ack_msg = format!(
        "ack/proof_instance_id:{}/partial_proof:{}",
        input.proof_instance_id, partial_proof,
    );

    let prfs_ack_sig = match state.wallet.sign_message(ack_msg).await {
        Ok(s) => s.to_string(),
        Err(err) => {
            let resp = ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: input.proof_instance_id.to_string(),
        proof_type_id: input.proof_type_id,
        short_id: short_id.to_string(),
        proof: input.proof.to_vec(),
        public_inputs: input.public_inputs.clone(),
        prfs_ack_sig: prfs_ack_sig.to_string(),
        created_at: chrono::offset::Utc::now(),
    };

    let proof_instance_id =
        match prfs::insert_prfs_proof_instances(&mut tx, &vec![prfs_proof_instance]).await {
            Ok(i) => i,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

    bail_out_tx_commit!(tx, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsProofInstanceResponse {
        proof_instance_id,
        prfs_ack_sig,
    });
    return (StatusCode::OK, Json(resp));
}
