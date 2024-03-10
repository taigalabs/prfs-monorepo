use ethers_core::types::U256;
use k256::ecdsa::RecoveryId;
use k256::elliptic_curve::generic_array::GenericArray;
use k256::schnorr::signature::SignatureEncoding;
use k256::schnorr::SignatureBytes;
// use ecdsa::elliptic_curve::SecretKey;
// use ethers_core::k256::ecdsa::{RecoveryId, SigningKey};
// use ethers_core::k256::{PublicKey, SecretKey};
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
// use p256::{
//     ecdsa::{Signature, SigningKey, VerifyingKey},
//     NonZeroScalar, U256,
// };
use rand_core::OsRng; // requires 'getrandom' feature
                      // use secp256k1::hashes::sha256;
                      // use secp256k1::rand::rngs::OsRng;
                      // use secp256k1::{Message, PublicKey, Secp256k1, SecretKey};
use k256::{
    ecdsa::{signature::Signer, Signature, SigningKey},
    SecretKey,
};
use k256::{
    ecdsa::{signature::Verifier, VerifyingKey},
    EncodedPoint,
};

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

    // let sig_ = hex::decode(&input.author_sig[2..]).unwrap();
    // println!("sig_: {:?}", sig_);

    // let mut r = input.author_sig.r.clone();
    // let mut s = input.author_sig.s.clone();
    // r.append(&mut s);
    //
    let sk_ = hex::decode(&sk_str[2..]).unwrap();
    let sk = SigningKey::from_slice(&sk_).unwrap();
    println!("sk: {:?}", sk.to_bytes());

    // let signing_key = SigningKey::random(&mut OsRng);
    // let b = signing_key.to_bytes();
    // println!("signingkey: {:?}", b);
    let msg: &[u8] = &[0, 10];
    let signature: Signature = sk.sign(msg);
    println!("sig: {:?}", signature);

    // let r = &input.author_sig.r;
    // let r = GenericArray::from_slice(r);
    // let s = &input.author_sig.s;
    // let s = GenericArray::from_slice(s);

    let sig22 = Signature::try_from(
        [
            77, 35, 181, 217, 215, 117, 86, 109, 184, 143, 231, 111, 55, 41, 205, 163, 132, 124,
            34, 99, 213, 187, 241, 143, 190, 74, 41, 0, 127, 83, 44, 233, 110, 1, 22, 190, 32, 234,
            145, 71, 121, 193, 241, 202, 220, 125, 164, 51, 248, 173, 65, 6, 151, 113, 228, 183,
            253, 34, 120, 214, 27, 187, 216, 95,
        ]
        .as_slice(),
    )
    .unwrap();
    println!("sig22: {:?}", sig22.to_bytes());

    let signature_ = signature.to_bytes();
    println!("signature_: {:?}", signature_);

    let recid = RecoveryId::from_byte(1).unwrap();
    let vk = VerifyingKey::recover_from_msg(&msg, &sig22, recid).unwrap();
    // let verifying_key = VerifyingKey::from(&sk); // Serialize with `::to_encoded_point()`
    //                                              // verifying_key.to_encoded_point(compress)
    let res = vk.verify(msg, &signature);
    println!("res: {:?}, vk: {:?}", res, vk.to_sec1_bytes());

    // &input.author_sig.s].concat().unwrap();

    // println!("sk: {:?}", sk);
    // let sig = Signature::from_slice(&r).unwrap();
    // println!("sig: {:?}", sig);

    // let sk = SigningKey::from_slice(&[0]).unwrap();
    // let (signature, v) = sk.sign_recoverable(&input.author_sig_msg_hash).unwrap();
    // println!("sig: {:?}, v: {:?}", signature, v);

    // // input.author_sig
    // println!("123: sig: {:?}, v: {:?}: msg: {:?}", signature, v, msg);
    // let v_ = (input.author_sig.v - 27).try_into().unwrap();
    // let v = RecoveryId::from_byte(v_).unwrap();
    // let recovered_vk = VerifyingKey::recover_from_msg(&input.author_sig_msg_hash, &sig, v).unwrap();
    // println!("recovered vk: {:?}", recovered_vk);

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
        author_sig: "1".to_string(),
    };

    let post_id = shy::insert_shy_post(&mut tx, &shy_post).await.unwrap();
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}
