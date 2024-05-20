use prfs_api_rs::api::create_prfs_proof_record;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::{bail_out_tx, bail_out_tx_commit};
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_web3_rs::signature::verify_eth_sig_by_pk;
use shy_api_error_codes::SHY_API_ERROR_CODES;
use shy_db_interface::shy;
use shy_entities::{CreateShyCommentAction, ShyCommentProofAction, ShyCommentWithProofs};
use shy_entities::{
    CreateShyCommentRequest, CreateShyCommentResponse, CreateShyCommentWithProofsRequest,
    GetShyCommentsOfTopicRequest, GetShyCommentsOfTopicResponse,
};
use shy_entities::{ShyComment, ShyProof};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 15;

pub async fn get_shy_comments_of_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyCommentsOfTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyCommentsOfTopicResponse>>) {
    let pool = &state.db2.pool;

    let shy_comments = match shy::get_shy_comments_by_topic_id(
        &pool,
        &input.topic_id,
        input.offset,
        LIMIT,
    )
    .await
    {
        Ok(p) => p,
        Err(err) => {
            let resp = ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let mut shy_comments_with_proofs: Vec<ShyCommentWithProofs> = vec![];
    for comment in &shy_comments {
        let shy_proofs =
            match shy::get_shy_proofs_by_proof_ids(pool, &comment.inner.author_proof_ids).await {
                Ok(p) => p,
                Err(err) => {
                    let resp =
                        ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                    return (StatusCode::BAD_REQUEST, Json(resp));
                }
            };

        shy_comments_with_proofs.push(ShyCommentWithProofs {
            shy_comment: comment.clone(),
            shy_proofs,
        });
    }

    let next_offset = if shy_comments_with_proofs.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyCommentsOfTopicResponse {
        shy_comments_with_proofs,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_comment(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyCommentRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyCommentResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let shy_proofs = match shy::get_shy_proofs(&pool, &input.author_public_key).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    if shy_proofs.len() < 1 {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
            format!(
                "Proof not found, author_pub_key: {}",
                input.author_public_key
            ),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let mut topic = match shy::get_shy_topic__tx(&mut tx, &input.topic_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    topic.inner.total_reply_count += 1;

    let action = ShyCommentProofAction::create_shy_comment(CreateShyCommentAction {
        topic_id: input.topic_id.to_string(),
        comment_id: input.comment_id.to_string(),
        content: input.content.to_string(),
    });

    let msg = serde_json::to_vec(&action).unwrap();
    // if msg != input.author_sig_msg {
    //     let resp = ApiResponse::new_error(
    //         &SHY_API_ERROR_CODES.NOT_MACHING_SIG_MSG,
    //         format!("msg: {:?}", input.author_sig_msg),
    //     );
    //     return (StatusCode::BAD_REQUEST, Json(resp));
    // }

    if let Err(err) = verify_eth_sig_by_pk(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let author_proof_ids: Vec<String> = shy_proofs
        .iter()
        .map(|p| p.shy_proof_id.to_string())
        .collect();

    let shy_comment = ShyComment {
        comment_id: input.comment_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        // shy_proof_id: input.shy_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig,
        author_proof_ids,
    };

    let comment_id = match shy::insert_shy_comment(&mut tx, &shy_comment).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy comment, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    match shy::insert_shy_topic(&mut tx, &topic.inner).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy comment, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreateShyCommentResponse { comment_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_comment_with_proofs(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyCommentWithProofsRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyCommentResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = bail_out_tx!(pool, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let action = ShyCommentProofAction::create_shy_comment(CreateShyCommentAction {
        topic_id: input.topic_id.to_string(),
        comment_id: input.comment_id.to_string(),
        content: input.content.to_string(),
    });

    let msg = match serde_json::to_vec(&action) {
        Ok(m) => m,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, format!("err: {}", err));
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    // if msg != input.author_sig_msg {
    //     let resp = ApiResponse::new_error(
    //         &SHY_API_ERROR_CODES.NOT_MACHING_SIG_MSG,
    //         format!("msg: {:?}", input.author_sig_msg),
    //     );
    //     return (StatusCode::BAD_REQUEST, Json(resp));
    // }

    if let Err(err) = verify_eth_sig_by_pk(&input.author_sig, &msg, &input.author_public_key) {
        let resp = ApiResponse::new_error(
            &SHY_API_ERROR_CODES.INVALID_SIG,
            format!("sig: {}, err: {}", input.author_sig, err),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let mut author_proof_ids: Vec<String> = vec![];

    for proof in input.proofs {
        let _proof_record_resp = match create_prfs_proof_record(
            &ENVS.prfs_api_server_endpoint,
            &proof.proof,
            &input.author_public_key,
        )
        .await
        {
            Ok(r) => r,
            Err(err) => {
                let resp =
                    ApiResponse::new_error(&SHY_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };

        let shy_proof = ShyProof {
            shy_proof_id: proof.shy_proof_id.to_string(),
            proof: proof.proof,
            public_inputs: proof.public_inputs.to_string(),
            public_key: proof.author_public_key.to_string(),
            serial_no: proof.serial_no,
            proof_identity_input: proof.proof_identity_input.to_string(),
            proof_type_id: proof.proof_type_id,
            proof_idx: proof.proof_idx,
        };

        let proof_id = match shy::insert_shy_proof(&mut tx, &shy_proof).await {
            Ok(i) => i,
            Err(err) => {
                let resp = ApiResponse::new_error(
                    &SHY_API_ERROR_CODES.RECORD_INSERT_FAIL,
                    err.to_string(),
                );
                return (StatusCode::BAD_REQUEST, Json(resp));
            }
        };
        author_proof_ids.push(proof_id);
    }

    let mut topic = match shy::get_shy_topic__tx(&mut tx, &input.topic_id).await {
        Ok(t) => t,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.SHY_PROOF_RETRIEVAL_FAIL,
                err.to_string(),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };
    topic.inner.total_reply_count += 1;

    let shy_comment = ShyComment {
        comment_id: input.comment_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        // shy_proof_id: input.shy_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig.to_string(),
        author_proof_ids,
    };

    let comment_id = match shy::insert_shy_comment(&mut tx, &shy_comment).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy comment, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    match shy::insert_shy_topic(&mut tx, &topic.inner).await {
        Ok(i) => i,
        Err(err) => {
            let resp = ApiResponse::new_error(
                &SHY_API_ERROR_CODES.UNKNOWN_ERROR,
                format!("Can't insert shy comment, err: {}", err),
            );
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    bail_out_tx_commit!(tx, &SHY_API_ERROR_CODES.UNKNOWN_ERROR);

    let resp = ApiResponse::new_success(CreateShyCommentResponse { comment_id });
    return (StatusCode::OK, Json(resp));
}
