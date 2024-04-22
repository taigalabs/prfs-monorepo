use ethers_signers::Signer;
use prfs_api_error_codes::PRFS_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;

use prfs_db_interface::prfs;
use prfs_entities::entities::PrfsProofInstance;
use prfs_entities::prfs_api::{
    CreatePrfsProofInstanceRequest, CreatePrfsProofInstanceResponse,
    GetPrfsProofInstanceByInstanceIdRequest, GetPrfsProofInstanceByInstanceIdResponse,
    GetPrfsProofInstanceByShortIdRequest, GetPrfsProofInstanceByShortIdResponse,
    GetPrfsProofInstancesRequest, GetPrfsProofInstancesResponse,
};
use prfs_entities::proof_action::{CreatePrfsProofAction, PrfsProofAction};
use prfs_entities::{CreatePrfsProofRequest, CreatePrfsProofResponse, PrfsProof};
use prfs_web3_rs::signature::verify_eth_sig_by_pk;
use std::sync::Arc;

use crate::envs::ENVS;

pub async fn create_prfs_proof(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreatePrfsProofRequest>,
) -> (StatusCode, Json<ApiResponse<CreatePrfsProofResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let action = PrfsProofAction::create_prfs_proof(CreatePrfsProofAction {
        nonce: input.nonce.to_string(),
    });

    let msg = serde_json::to_vec(&action).unwrap();
    if msg != input.author_sig_msg {
        let resp = ApiResponse::new_error(
            &PRFS_API_ERROR_CODES.NOT_MACHING_SIG_MSG,
            format!("msg: {:?}, author_sig_msg: {:?}", msg, input.author_sig_msg),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if let Err(err) = verify_eth_sig_by_pk(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &PRFS_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    // let _proof_record_resp =
    //     match prfs::insert_prfs_proof_record(&input.proof, &input.author_public_key).await {
    //         Ok(r) => r,
    //         Err(err) => {
    //             let resp =
    //                 ApiResponse::new_error(&PRFS_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
    //             return (StatusCode::BAD_REQUEST, Json(resp));
    //         }
    //     };

    let proof = PrfsProof {
        prfs_proof_id: input.prfs_proof_id.to_string(),
        proof: input.proof,
        public_inputs: input.public_inputs.to_string(),
        public_key: input.author_public_key.to_string(),
        serial_no: input.serial_no,
        proof_identity_input: input.proof_identity_input.to_string(),
        proof_type_id: input.proof_type_id,
    };

    let prfs_proof_id = match prfs::insert_prfs_proof(&mut tx, &proof).await {
        Ok(i) => i,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_API_ERROR_CODES.RECORD_INSERT_FAIL, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &PRFS_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreatePrfsProofResponse { prfs_proof_id });
    return (StatusCode::OK, Json(resp));
}
