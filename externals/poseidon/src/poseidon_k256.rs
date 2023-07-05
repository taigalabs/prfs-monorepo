use crate::{k256_consts, Poseidon, PoseidonConstants, PoseidonError};
use ff::PrimeField;
pub use secq256k1::field::field_secp::FieldElement;
use secq256k1::field::BaseField;

#[allow(dead_code)]
pub fn hash(input: Vec<FieldElement>) -> FieldElement {
    let round_constants: Vec<FieldElement> = k256_consts::ROUND_CONSTANTS
        .iter()
        .map(|x| FieldElement::from_str_vartime(x).unwrap())
        .collect();

    let mds_matrix: Vec<Vec<FieldElement>> = k256_consts::MDS_MATRIX
        .iter()
        .map(|x| {
            x.iter()
                .map(|y| FieldElement::from_str_vartime(y).unwrap())
                .collect::<Vec<FieldElement>>()
        })
        .collect();

    let constants = PoseidonConstants::<FieldElement>::new(
        round_constants,
        mds_matrix,
        k256_consts::NUM_FULL_ROUNDS,
        k256_consts::NUM_PARTIAL_ROUNDS,
    );
    let mut poseidon = Poseidon::new(constants);

    let result = poseidon.hash(input);

    result
}

pub fn hash_from_bytes(input_bytes: &[u8]) -> Result<Vec<u8>, PoseidonError> {
    let input = convert_bytes_to_field_elem_vec(input_bytes)?;
    let result = hash(input);

    Ok(result.to_bytes().to_vec())
}

pub fn hash_two(left: &[u8; 32], right: &[u8; 32]) -> Result<Vec<u8>, PoseidonError> {
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
        input.push(FieldElement::from(val));
    }

    Ok(input)
}
