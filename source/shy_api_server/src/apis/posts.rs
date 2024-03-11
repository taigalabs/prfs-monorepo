// use k256::schnorr::SigningKey;
// use ecdsa::elliptic_curve::SecretKey;
// use ethers_core::k256::ecdsa::{RecoveryId, SigningKey};
// use ethers_core::k256::{PublicKey, SecretKey};
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::prfs_api::{CreatePrfsProofRecordRequest, GetPrfsProofRecordResponse};
use sha2::Sha256;
use shy_db_interface::shy;
use shy_entities::entities::{ShyPost, ShyTopic, ShyTopicProof};
use shy_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, CreateShyTopicRequest, CreateShyTopicResponse,
    GetShyPostsOfTopicRequest, GetShyPostsOfTopicResponse, GetShyTopicRequest, GetShyTopicResponse,
    GetShyTopicsRequest, GetShyTopicsResponse,
};
use std::sync::Arc;

use rand_core::OsRng; // requires 'getrandom' feature
                      // use secp256k1::hashes::sha256;
                      // use secp256k1::rand::rngs::OsRng;
                      // use secp256k1::{Message, PublicKey, Secp256k1, SecretKey};
use crate::envs::ENVS;
use crate::error_codes::API_ERROR_CODE;
use hex_literal::hex;
use k256::{
    ecdsa::{signature::Signer, RecoveryId, Signature, SigningKey, VerifyingKey},
    SecretKey,
};
// use sha3::{Digest, Keccak256};

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
    // let sk_ = hex::decode(&sk_str[2..]).unwrap();
    // let sk = SigningKey::from_slice(&sk_).unwrap();
    // println!("sk: {:?}", sk.to_bytes());

    // // let signing_key = SigningKey::random(&mut OsRng);
    // // let b = signing_key.to_bytes();
    // // println!("signingkey: {:?}", b);
    // let msg: &[u8] = &[0, 10];
    // let signature: Signature = sk.sign(msg);
    // println!("sig: {:?}", signature);

    // // let r = &input.author_sig.r;
    // // let r = GenericArray::from_slice(r);
    // // let s = &input.author_sig.s;
    // // let s = GenericArray::from_slice(s);

    // let signature_ = signature.to_bytes();
    // println!("signature_: {:?}", signature_);

    // let recid = RecoveryId::from_byte(1).unwrap();
    // let vk = VerifyingKey::recover_from_msg(&msg, &sig22, recid).unwrap();
    // // let verifying_key = VerifyingKey::from(&sk); // Serialize with `::to_encoded_point()`
    // //                                              // verifying_key.to_encoded_point(compress)
    // let res = vk.verify(msg, &signature);
    // println!("res: {:?}, vk: {:?}", res, vk.to_sec1_bytes());

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

#[test]
fn test_1() {
    println!("12312311");

    let sk_ = hex::decode(&sk_str[2..]).unwrap();
    let sk = SigningKey::from_slice(&sk_).unwrap();
    println!("sk: {:?}", sk.to_bytes());

    let msg: &[u8] = &[0, 10];

    let sig: Signature = sk.sign(msg);
    println!(
        "sigBytes: {:?}\n r: {:?}\n  s: {:?}",
        sig.to_bytes(),
        sig.r().to_bytes(),
        sig.s().to_bytes(),
    );

    let recid = RecoveryId::from_byte(1).unwrap();
    let vk = VerifyingKey::recover_from_msg(&msg, &sig, recid).unwrap();
    // let verifying_key = VerifyingKey::from(&sk); // Serialize with `::to_encoded_point()`
    //                                              // verifying_key.to_encoded_point(compress)
    // let res = vk.verify(msg, &sig);
    println!("\nvk: {:?}", vk.to_sec1_bytes());
}

#[tokio::test]
async fn test_2() {
    // use hashes::{sha256, Hash};
    use secp256k1::hashes::{sha256, Hash};
    use secp256k1::{
        ecdsa, Error, Message, PublicKey, Secp256k1, SecretKey, Signing, Verification,
    };

    fn sign<C: Signing>(
        secp: &Secp256k1<C>,
        msg: &[u8],
        seckey: [u8; 32],
    ) -> Result<ecdsa::Signature, Error> {
        let msg = sha256::Hash::hash(msg);
        let msg = Message::from_digest_slice(msg.as_ref())?;
        let seckey = SecretKey::from_slice(&seckey)?;
        Ok(secp.sign_ecdsa(&msg, &seckey))
    }
    let secp = Secp256k1::new();

    let msg = &[0, 10];
    let signature = sign(&secp, msg, seckey).unwrap();

    let serialize_sig = signature.serialize_compact();

    println!("sig: {:?}, ser: {:?}", signature, serialize_sig);
}

#[tokio::test]
async fn test_3() {
    use ethers_core::{k256::ecdsa::SigningKey, types::TransactionRequest};
    use ethers_signers::{LocalWallet, Signer};

    // pub fn sign_hash(&self, hash: H256) -> Signature {
    //     // sign_prehashed(d, k, z)
    //     let (recoverable_sig, recovery_id) = self.signer.sign_prehash(hash.as_ref())?;

    //     let v = u8::from(recovery_id) as u64 + 27;

    //     let r_bytes: FieldBytes<Secp256k1> = recoverable_sig.r().into();
    //     let s_bytes: FieldBytes<Secp256k1> = recoverable_sig.s().into();
    //     let r = U256::from_big_endian(r_bytes.as_slice());
    //     let s = U256::from_big_endian(s_bytes.as_slice());

    //     Signature { r, s, v }
    // }

    // let message = "Some data";

    // // Sign the message
    // let signature = wallet.sign_message(message).await.unwrap();
    // println!("sig: {:?}", signature);

    // Recover the signer from the message
    // let recovered = signature.recover(message).unwrap();

    // assert_eq!(recovered, wallet.address());
}
