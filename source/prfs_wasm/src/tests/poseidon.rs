use ff::PrimeField;
use poseidon::{
    self,
    poseidon_k256::{convert_bytes_to_field_elem_vec, hash, hash_from_bytes, FieldElement},
};
use rs_merkle::Hasher;
use secq256k1::field::BaseField;

#[derive(Clone)]
pub struct PoseidonHash {}

impl Hasher for PoseidonHash {
    type Hash = [u8; 32];

    fn hash(data: &[u8]) -> [u8; 32] {
        let v = convert_bytes_to_field_elem_vec(data).unwrap();
        println!("v: {:?}", v);

        let res = hash(v);
        let arr1 = res.to_be_bytes();

        println!("arr1: {:?}", arr1.len());
        arr1
    }
}

// let mut input = Vec::new();
// for i in 0..(input_bytes.len() / 32) {
//     let f: [u8; 32] = input_bytes[(i * 32)..(i + 1) * 32].try_into().unwrap();
//     let val = FieldElement::from_bytes(&f).unwrap();
//     input.push(FieldElement::from(val));
// }

// let result = hash(input);

// Ok(result.to_bytes().to_vec())
