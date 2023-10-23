use super::api::*;
use ff::PrimeField;
use secq256k1::field::{field_secq::FieldElement, BaseField};

#[test]
fn check_nizk() {
    println!("check_nizk()");

    let root = std::env::current_dir().unwrap();
    println!("root: {:?}", root);

    let circuit = std::fs::read(root.join("test_circuit/test_circuit.circuit")).unwrap();
    let vars = std::fs::read(root.join("test_circuit/witness.wtns")).unwrap();
    // println!("vars: {:?}", vars);

    let public_inputs = [F1::from(1u64), F1::from(1u64), F1::from(1u64)]
        .iter()
        .map(|w| w.to_repr())
        .flatten()
        .collect::<Vec<u8>>();

    println!("\npublic_inputs: {:?}", public_inputs);

    let proof = prove2(
        circuit.as_slice(),
        vars.as_slice(),
        public_inputs.as_slice(),
    )
    .unwrap();

    // let proof_path = root.join("proof.bin");
    // fs::write(proof_path, &proof).unwrap();
    // let proof = std::fs::read(proof_path).unwrap();

    println!("\nproof len: {:?}", proof.len());

    let result = verify(
        circuit.as_slice(),
        proof.as_slice(),
        public_inputs.as_slice(),
    );

    println!("\nresult: {:?}", result);

    assert!(result.unwrap());
}

#[test]
fn test_poseidon() {
    // Using the same inputs as poseidon.test.ts
    let a = FieldElement::from_str_vartime(
        "115792089237316195423570985008687907853269984665640564039457584007908834671663",
    )
    .unwrap()
    .to_bytes();
    let b = FieldElement::from_str_vartime(
        "115792089237316195423570985008687907853269984665640564039457584007908834671662",
    )
    .unwrap()
    .to_bytes();

    let mut inputs = [0u8; 64];
    inputs[..32].copy_from_slice(&a);
    inputs[32..].copy_from_slice(&b);
    // let result = poseidon(&inputs).unwrap();

    // assert_eq!(
    //     result.as_slice(),
    //     &[
    //         181, 226, 121, 200, 61, 3, 57, 70, 184, 30, 115, 145, 192, 7, 138, 73, 36, 8, 40,
    //         132, 190, 141, 35, 89, 108, 149, 235, 51, 129, 165, 64, 103
    //     ]
    // )
}
