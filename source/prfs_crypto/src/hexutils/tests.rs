use crypto_bigint::{Wrapping, U256};
use ff::PrimeField;
use k256::{self, elliptic_curve::Curve, Scalar};
use secq256k1::elliptic_curve::bigint::Wrapping;

#[test]
fn test_convert_str_into_k256_number_1() {
    let str = "Nonce member";
    let str2 = "Nonce member long string alksfe awkejf akefj askrjfg lsdkfjg lskdjfg lskdjfg lskdjfg lskdjfvbl kxjcvbl ksjdfrgl ksjdfgl kjsadflg kjasdflg kjasdlf kjaslef kjae";

    let bytes = str2.as_bytes();
    let hx = hex::encode(bytes);
    println!("hx: {}", hx);

    pub const m: U256 =
        U256::from_be_hex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

    println!("m: {}", m);

    // let s = Scalar::from_str_vartime(&num.to_string()).unwrap();

    // println!("bytes: {:?}, num: {}", bytes, num);
}
