use ethers_core::types::Signature;
use ethers_core::utils::keccak256;
use k256::ecdsa::VerifyingKey;
use primitive_types::H160;
use std::str::FromStr;

use crate::PrfsCryptoError;

pub fn verify_eth_sig_by_pk<S: AsRef<str>>(
    sig: S,
    msg: &[u8],
    public_key: S,
) -> Result<H160, PrfsCryptoError> {
    println!("sig: {}, public_key: {}", sig.as_ref(), public_key.as_ref());

    let sig_deserialized = Signature::from_str(&sig.as_ref()[2..])?;
    let addr1 = sig_deserialized.recover(msg)?;

    let vk_bytes = hex::decode(&public_key.as_ref()[2..])?;
    let vk2 = VerifyingKey::from_sec1_bytes(&vk_bytes).map_err(|err| {
        format!(
            "Verifying key cannot be made pk: {}, vk_bytes: {:?}, err: {:?}",
            public_key.as_ref(),
            vk_bytes,
            err
        )
    })?;

    let point = vk2.to_encoded_point(false);
    let point_bytes = point.as_bytes();
    let hash = keccak256(&point_bytes[1..]);

    if &hash[12..] == addr1.as_bytes() {
        return Ok(addr1);
    } else {
        let addr1 = hex::encode(addr1.as_bytes());
        let addr2 = hex::encode(&hash[12..]);

        return Err(format!(
            "addrs are different, addr_recovered: {:?}, addr_public_key: {:?}, sig: {}",
            addr1,
            addr2,
            sig.as_ref()
        )
        .into());
    }
}

pub fn verify_eth_sig_by_addr<S: AsRef<str>>(
    sig: S,
    msg: &[u8],
    addr: S,
) -> Result<String, PrfsCryptoError> {
    let sig_deserialized = Signature::from_str(&sig.as_ref()[2..])?;
    let addr1 = sig_deserialized.recover(msg)?;
    let addr1 = addr1.to_string().to_lowercase();
    let addr = addr.as_ref().to_string().to_lowercase();

    println!("addr1: {}, addr: {}", addr1, addr);

    if addr1 == addr {
        return Ok(addr1);
    } else {
        return Err(format!(
            "addrs are different, addr_recovered: {:?}, addr: {}, sig: {}",
            addr1,
            addr,
            sig.as_ref()
        )
        .into());
    }
}
