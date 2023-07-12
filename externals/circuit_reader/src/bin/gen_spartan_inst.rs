#![allow(non_snake_case)]
use bincode;
use circuit_reader::load_as_spartan_inst;
use std::env::{args, current_dir};
use std::fs::File;
use std::io::Write;

fn main() {
    println!("\ngen_spartan_inst()");
    let circom_r1cs_path = args().nth(1).unwrap();
    // println!("circom_r1cs_path: {}", circom_r1cs_path);

    let output_path = args().nth(2).unwrap();
    println!("output_path: {}", output_path);

    let num_pub_inputs = args().nth(3).unwrap().parse::<usize>().unwrap();
    println!("num_pub_inputs: {}", num_pub_inputs);

    let root = current_dir().unwrap();
    let circom_r1cs_path = root.join(circom_r1cs_path);
    println!("circom_r1cs_path: {:?}", circom_r1cs_path);

    let spartan_inst = load_as_spartan_inst(&circom_r1cs_path, num_pub_inputs);
    let sparta_inst_bytes = bincode::serialize(&spartan_inst).unwrap();

    File::create(root.join(output_path.clone()))
        .unwrap()
        .write_all(sparta_inst_bytes.as_slice())
        .unwrap();

    println!("Success writing spartan circuit to {}", output_path);
}
