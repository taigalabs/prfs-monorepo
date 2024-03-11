use ethers_core::abi::AbiEncode;
use ethers_core::types::Signature;
use ethers_core::utils::keccak256;
use ethers_core::{types::RecoveryMessage, utils::hash_message};
use ethers_signers::{LocalWallet, Signer};
use k256::ecdsa::{RecoveryId, SigningKey, VerifyingKey};
use k256::elliptic_curve::sec1::ToEncodedPoint;
use k256::elliptic_curve::PublicKey;
use k256::schnorr::signature::Keypair;
use k256::PublicKey as K256Publickey;
use std::str::FromStr;

use crate::PrfsCryptoError;

pub fn verify_ethSignature(sig: String) {}

#[test]
fn test_1() {
    use k256::schnorr::signature::Signer;
    use k256::schnorr::SigningKey;

    // let sk_str = "_";
    // let sk_ = hex::decode(&sk_str[2..]).unwrap();
    // let sk = SigningKey::from_slice(&sk_).unwrap();
    // println!("sk: {:?}", sk.to_bytes());

    // let msg: &[u8] = &[0, 10];

    // let sig: Signature = sk.sign(msg);
    // println!(
    //     "sigBytes: {:?}\n r: {:?}\n  s: {:?}",
    //     sig.to_bytes(),
    //     sig.r().to_bytes(),
    //     sig.s().to_bytes(),
    // );

    // let recid = RecoveryId::from_byte(1).unwrap();
    // let vk = VerifyingKey::recover_from_msg(&msg, &sig, recid).unwrap();
    // // let verifying_key = VerifyingKey::from(&sk); // Serialize with `::to_encoded_point()`
    // //                                              // verifying_key.to_encoded_point(compress)
    // // let res = vk.verify(msg, &sig);
    // println!("\nvk: {:?}", vk.to_sec1_bytes());
}

#[tokio::test]
async fn test_2() {
    let sk = "72784c91a7f6320ee5fc0b06004dbf1645769969fbfe2eaa2d4ce13c069eade6";
    let sk_bytes = hex::decode(sk).unwrap();

    let signing_key = SigningKey::from_slice(&sk_bytes).unwrap();
    let vk = signing_key.verifying_key();
    let point = vk.to_encoded_point(false);
    let point_bytes = point.as_bytes();
    let hash = keccak256(&point_bytes[1..]);
    let addr1 = format!("0x{}", hex::encode(&hash[12..]));
    println!("hash: {:?}, addr: {}", hash, addr1);

    let wallet = sk.parse::<LocalWallet>().unwrap();

    // let msg = &[0, 10];
    let msg = r#"{a: "가나다"}"#.as_bytes();
    println!("msg: {:?}", msg);

    let sig = wallet.sign_message(msg).await.unwrap();
    println!("sig: {:?}", sig);

    let b = sig.to_vec();
    println!("b: {:?}", b);

    let sig_hex = hex::encode(b);
    println!("sig_hex: {}", sig_hex);

    let sig_deserialized = Signature::from_str(&sig_hex).unwrap();
    println!("sig_des: {:?}", sig_deserialized);

    let addr2 = sig_deserialized.recover(msg).unwrap();

    assert_eq!(&hash[12..], addr2.as_bytes());
}
