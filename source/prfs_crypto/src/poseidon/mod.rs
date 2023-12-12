use ff::PrimeField;
use halo2curves::{ff::Field, secp256k1::Fp};
use neptune::{poseidon::PoseidonConstants, Poseidon};
use poseidon::{
    poseidon_k256::hash, Poseidon as NeptunePoseidon,
    PoseidonConstants as NeptunePoseidonConstants, PoseidonError,
};
use secq256k1::field::field_secp::FieldElement;
use secq256k1::field::BaseField;
use sha2::digest::typenum::{U1, U2};

use crate::PrfsCryptoError;

pub fn hash_from_bytes(input_bytes: &[u8]) -> Result<[u8; 32], PrfsCryptoError> {
    let input = convert_bytes_to_field_elem_vec(input_bytes)?;
    let result = hash(input);

    Ok(result.to_bytes())
}

pub fn hash_two(left: &[u8; 32], right: &[u8; 32]) -> Result<[u8; 32], PoseidonError> {
    let mut input = [0u8; 64];
    input[..32].clone_from_slice(left);
    input[32..].clone_from_slice(right);

    hash_from_bytes(&input)
}

#[inline]
pub fn convert_bytes_to_field_elem_vec(
    input_bytes: &[u8],
) -> Result<Vec<FieldElement>, PoseidonError> {
    let mut input = Vec::new();
    for i in 0..(input_bytes.len() / 32) {
        let f: [u8; 32] = input_bytes[(i * 32)..(i + 1) * 32].try_into()?;
        let val = FieldElement::from_bytes(&f).unwrap();
        input.push(val);
    }

    Ok(input)
}

pub fn poseidon_32(arg: &[u8; 32]) -> Result<[u8; 32], PrfsCryptoError> {
    if arg.len() != 32 {}

    let fp1 = convert_bytes_to_field_elem(&arg[0..32]);

    let preimage = [fp1];
    let constants = PoseidonConstants::new();
    let mut h = Poseidon::<Fp, U1>::new_with_preimage(&preimage, &constants);
    let result = h.hash();
    return Ok(result.to_bytes());
}

pub fn poseidon_4() {}

pub fn poseidon_8() {}

fn convert_bytes_to_field_elem(arr: &[u8]) -> Fp {
    let f: [u8; 32] = arr[0..32].try_into().unwrap();
    Fp::from_bytes(&f).unwrap()
}
