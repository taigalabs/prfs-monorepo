use ff::PrimeField;
use poseidon::{
    poseidon_k256::hash, Poseidon as NeptunePoseidon,
    PoseidonConstants as NeptunePoseidonConstants, PoseidonError,
};
use secq256k1::field::field_secp::FieldElement;
use secq256k1::field::BaseField;
use sha2::digest::typenum::{U1, U2};

use crate::PrfsCryptoError;

#[deprecated]
pub fn hash_from_bytes(input_bytes: &[u8]) -> Result<[u8; 32], PrfsCryptoError> {
    let input = convert_bytes_to_field_elem_vec(input_bytes)?;
    let result = hash(input)?;

    Ok(result.to_bytes())
}

pub fn hash_two(left: &[u8; 32], right: &[u8; 32]) -> Result<[u8; 32], PoseidonError> {
    let mut input = [0u8; 64];
    input[..32].clone_from_slice(left);
    input[32..].clone_from_slice(right);

    hash_from_bytes(&input)
}

pub fn poseidon_2(arg1: &[u8; 32], arg2: &[u8; 32]) -> Result<[u8; 32], PoseidonError> {
    let f1 = convert_bytes_to_field_elem(arg1)?;
    let f2 = convert_bytes_to_field_elem(arg2)?;

    let h = hash(vec![f1, f2])?;
    return Ok(h.to_bytes());
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

#[inline]
pub fn convert_bytes_to_field_elem(input: &[u8; 32]) -> Result<FieldElement, PoseidonError> {
    if input.len() != 32 {
        return Err(format!("input should be 32 byte long, len: {}", input.len()).into());
    }

    let val = FieldElement::from_bytes(&input);
    let v = Option::<FieldElement>::from(val)
        .ok_or(format!("Field elem creation failed, input: {:?}", input).into());
    v
}
