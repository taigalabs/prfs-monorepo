use crypto_bigint::{Wrapping, U256};
use ethers_core::utils::keccak256;
use ff::PrimeField;
use k256::{self, elliptic_curve::Curve, Scalar};

use crate::convert_32bytes_le_into_decimal_string;

#[test]
fn test_convert_str_into_k256_number_1() {
    let str = "Nonce member";
    let str2 = "Nonce member long string alksfe awkejf akefj askrjfg lsdkfjg lskdjfg lskdjfg lskdjfg lskdjfvbl kxjcvbl ksjdfrgl ksjdfgl kjsadflg kjasdflg kjasdlf kjaslef kjae";

    let bytes = str2.as_bytes();
    let hash = keccak256(&bytes);

    let num = U256::from_le_slice(&hash);
    println!("num: {}, hash: {:?}", num, hash);

    // println!("m: {}", m);

    // let s = Scalar::from_str_vartime(&num.to_string()).unwrap();

    // println!("bytes: {:?}, num: {}", bytes, num);
}
