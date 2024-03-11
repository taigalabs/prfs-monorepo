use prfs_crypto::ethers_signers::{LocalWallet, Signer};
use prfs_crypto::k256::ecdsa::{RecoveryId, Signature, SigningKey, VerifyingKey};

#[test]
fn test_1() {
    use prfs_crypto::k256::schnorr::signature::Signer;

    let sk_str = "_";
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
    let sk = "_";
    let wallet = sk.parse::<LocalWallet>().unwrap();

    // let msg = &[0, 10];
    let msg = r#"{a: "가나다"}"#.as_bytes();
    println!("msg: {:?}", msg);
    let sig = wallet.sign_message(msg).await.unwrap();
    println!("sig: {:?}", sig);

    let b = sig.to_vec();
    println!("b: {:?}", b);

    let sigHex = hex::encode(b);
    println!("sigHex: {}", sigHex);
}
