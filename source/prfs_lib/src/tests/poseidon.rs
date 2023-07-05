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

        let res: [u8; 32] = hash_from_bytes(data).unwrap().try_into().unwrap();
        res
    }
}
