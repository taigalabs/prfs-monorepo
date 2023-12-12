use halo2curves::{ff::Field, secp256k1::Fp};
use neptune::{poseidon::PoseidonConstants, Poseidon};
use sha2::digest::typenum::U2;

use crate::hash_from_bytes;

#[test]
pub fn test_poseidon2() {
    let res = poseidon2();
    println!("res: {:?}", res);
}

#[test]
pub fn test_poseidon() {
    let arr: &[u8] = &[
        50, 99, 48, 53, 50, 54, 57, 56, 97, 99, 52, 48, 102, 98, 57, 57, 101, 57, 52, 56, 100, 100,
        102, 98, 50, 102, 102, 57, 57, 101, 49, 54, 100, 102, 99, 56, 53, 49, 53, 51, 57, 52, 97,
        98, 98, 52, 49, 100, 101, 50, 100, 101, 98, 100, 54, 52, 102, 56, 100, 49, 48, 55, 100, 98,
        51, 98, 101, 54, 50, 50, 97, 99, 48, 49, 53, 51, 97, 57, 100, 52, 50, 99, 49, 98, 51, 52,
        102, 56, 53, 99, 52, 100, 52, 55, 57, 54, 50, 102, 98, 50, 54, 54, 49, 53, 98, 51, 51, 54,
        100, 48, 97, 57, 98, 55, 98, 100, 101, 99, 55, 98, 51, 98, 57, 48, 52, 98, 102, 49,
    ];

    let arr: &[u8] = &[
        50, 99, 48, 53, 50, 54, 57, 56, 97, 99, 52, 48, 102, 98, 57, 57, 101, 57, 52, 56, 100, 100,
        102, 98, 50, 102, 102, 57, 57, 101, 49, 54, 100, 102, 99, 56, 53, 49, 53, 51, 57, 52, 97,
        98, 98, 52, 49, 100, 101, 50, 100, 101, 98, 100, 54, 52, 102, 56, 100, 49, 48, 55, 100, 98,
        51, 98, 101, 54, 50, 50, 97, 99, 48, 49, 53, 51, 97, 57, 100, 52, 50, 99, 49, 98, 51, 52,
        102, 56, 53, 99, 52, 100, 52, 55,
        57,
        //54,
        //50,
        // 102, 98, 50, 54, 54, 49, 53, 98, 51, 51, 54,
        // 100, 48, 97, 57, 98, 55, 98, 100, 101, 99, 55, 98, 51, 98, 57, 48, 52, 98, 102, 49,
    ];

    println!("arr: {:?} len: {}", arr, arr.len());

    let res = hash_from_bytes(arr).unwrap();
    println!("res: {:?}", res);
}

pub fn poseidon2() -> Fp {
    let test_arity = 2;
    // let mut preimage = vec![Fr::ZERO; test_arity];
    // let constants = PoseidonConstants::new();
    // preimage[0] = <Fr as Field>::ONE;
    //
    //
    // Fp::from_bytes(&[9]);
    let mut preimage = vec![Fp::ZERO; test_arity];
    let constants = PoseidonConstants::new();
    preimage[0] = <Fp as Field>::ONE;

    let mut h = Poseidon::<Fp, U2>::new_with_preimage(&preimage, &constants);

    let mut h2 = h.clone();
    let result = h.hash();

    println!("result: {:?}", result);

    assert_eq!(result, h2.hash());

    return result;
}
