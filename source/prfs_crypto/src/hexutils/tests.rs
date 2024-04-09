use crypto_bigint::{Wrapping, U256};
use ethers_core::utils::keccak256;
use rust_decimal::Decimal;

use crate::convert_str_into_keccak_u256;

#[test]
fn test_convert_str_into_k256_number_1() {
    let str2 = "Nonce member long string alksfe awkejf akefj askrjfg lsdkfjg lskdjfg lskdjfg lskdjfg lskdjfvbl kxjcvbl ksjdfrgl ksjdfgl kjsadflg kjasdflg kjasdlf kjaslef kjae";

    let num = convert_str_into_keccak_u256(str2);
    println!("num: {}", num);
}

#[test]
fn test_convert_str_into_k256_number_2() {
    let str2 = "Nonce member";

    let num = convert_str_into_keccak_u256(str2);
}
