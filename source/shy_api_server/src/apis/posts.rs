// use ethers_core::k256::ecdsa::{RecoveryId, SigningKey};
// use ethers_core::k256::ecdsa::{VerifyingKey};
use ethers_core::k256::pkcs8::DecodePublicKey;
use ethers_core::k256::PublicKey;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, CreateShyTopicRequest, CreateShyTopicResponse,
    GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};
use std::str::FromStr;
use std::sync::Arc;

// use elliptic_curve::ops::Reduce;
use p256::{
    ecdsa::{Signature, SigningKey, VerifyingKey},
    NonZeroScalar, U256,
};
use rand_core::OsRng; // requires 'getrandom' feature
                      // use secp256k1::hashes::sha256;
                      // use secp256k1::rand::rngs::OsRng;
                      // use secp256k1::{Message, PublicKey, Secp256k1, SecretKey};

use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;

const LIMIT: i32 = 15;

pub async fn get_shy_posts_of_topic(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostsOfTopicRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostsOfTopicResponse>>) {
    let pool = &state.db2.pool;

    // let shy_topic = shy::get_shy_posts_of_topic(pool, &input.topic_id, input.offset, LIMIT)
    //     .await
    //     .unwrap();

    panic!();
    // let resp = ApiResponse::new_success(GetShyPostsOfTopicResponse { shy_topic });
    // return (StatusCode::OK, Json(resp));
}

pub async fn create_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    println!("power: {:?}", input);
    // let message = Message::from_hashed_data::<sha256::Hash>(input.author_sig_msg.as_bytes());
    // println!("message: {}", message);
    let msg = b"example";
    let sk = SigningKey::random(&mut OsRng);
    let (signature, v) = sk.sign_recoverable(msg).unwrap();
    println!("123: sig: {:?}, v: {:?}: msg: {:?}", signature, v, msg);
    let recovered_vk = VerifyingKey::recover_from_msg(msg, &signature, v).unwrap();
    println!("recovered vk: {:?}", recovered_vk);

    // let sig = Signature::from_str(&input.author_sig).unwrap();

    // let recovered_vk = VerifyingKey::recover_from_msg(
    //     &input.author_sig_msg.as_bytes(),
    //     &sig,
    //     RecoveryId::from_byte(3).unwrap(),
    // )
    // .unwrap();
    // println!("{:?}", recovered_vk);

    let shy_post = ShyPost {
        post_id: input.post_id,
        topic_id: input.topic_id,
        content: input.content,
        channel_id: input.channel_id,
        shy_topic_proof_id: input.shy_topic_proof_id,
        author_public_key: input.author_public_key,
        author_sig: input.author_sig,
    };

    let post_id = shy::insert_shy_post(&mut tx, &shy_post).await.unwrap();
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}
