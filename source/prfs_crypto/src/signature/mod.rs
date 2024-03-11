use ethers_core::types::Signature;
use ethers_core::utils::keccak256;
use k256::ecdsa::VerifyingKey;
use primitive_types::H160;
use std::str::FromStr;

use crate::PrfsCryptoError;

pub fn verify_eth_sig<S: AsRef<str>>(
    sig: S,
    msg: S,
    public_key: S,
) -> Result<H160, PrfsCryptoError> {
    let msg_ = msg.as_ref().as_bytes();
    println!("msg_: {:?}", msg_);

    let sig_deserialized = Signature::from_str(&sig.as_ref()[2..])?;
    let addr1 = sig_deserialized.recover(msg_)?;

    let vk_bytes = hex::decode(&public_key.as_ref()[2..])?;
    let vk2 = VerifyingKey::from_sec1_bytes(&vk_bytes)?;
    let point = vk2.to_encoded_point(false);
    let point_bytes = point.as_bytes();
    let hash = keccak256(&point_bytes[1..]);

    if &hash[12..] == addr1.as_bytes() {
        return Ok(addr1);
    } else {
        return Err(format!(
            "addrs are different, 1: {:?}, 2: {:?}",
            &hash[12..],
            addr1.as_bytes()
        )
        .into());
    }
}

#[tokio::test]
async fn test_1() {
    use ethers_signers::{LocalWallet, Signer};
    use k256::ecdsa::SigningKey;

    let sk = "72784c91a7f6320ee5fc0b06004dbf1645769969fbfe2eaa2d4ce13c069eade6";
    let sk_bytes = hex::decode(sk).unwrap();
    let signing_key = SigningKey::from_slice(&sk_bytes).unwrap();
    let vk = signing_key.verifying_key();

    let vk_bytes = vk.to_sec1_bytes();
    println!("vk_bytes: {:?}", vk_bytes);

    let vk_hex = format!("0x{}", hex::encode(&vk_bytes));
    println!("vk_hex: {}", vk_hex);

    let wallet = sk.parse::<LocalWallet>().unwrap();

    let msg = r#"{a: "가나다"}"#;
    let msg_bytes = msg.as_bytes();
    println!("msg: {:?}, msg_bytes: {:?}", msg, msg_bytes);

    let sig = wallet.sign_message(msg_bytes).await.unwrap();
    println!("sig: {:?}", sig);

    let sig_bytes = sig.to_vec();
    println!("sig bytes: {:?}", sig_bytes);

    let sig_hex = format!("0x{}", hex::encode(sig_bytes));
    println!("sig_hex: {}", sig_hex);

    let addr2 = verify_eth_sig(&sig_hex, &msg.to_string(), &vk_hex).unwrap();
    println!("addr: {}", addr2);
}
