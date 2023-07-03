use ff::PrimeField;
use halo2_proofs::halo2curves::{pasta::Fp, serde::SerdeObject};

pub fn convert_fp_to_string(fp: Fp) -> String {
    let repr = fp.to_repr();
    hex::encode(repr)
}

pub fn convert_string_into_fp(val: &str) -> Fp {
    let v = hex::decode(val).expect("value should be converted to byte array");
    let arr: [u8; 32] = v.try_into().unwrap();
    Fp::from_repr(arr).unwrap()
}

// pub fn pad_zero_if_necessary(hex_str: &str) -> String {}
