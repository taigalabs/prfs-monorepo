mod circom_reader;

pub use circom_reader::{load_r1cs_from_bin_file, R1CS};
use colored::Colorize;
use ff::PrimeField;
use libspartan::Instance;
use secq256k1::AffinePoint;
use secq256k1::FieldBytes;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

pub fn make_spartan_instance(
    circom_r1cs_path: &PathBuf,
    output_path: &PathBuf,
    num_pub_inputs: usize,
) {
    println!("{} spartan instance...", "Generating".green());

    // let circom_r1cs_path = args().nth(1).unwrap();
    println!("circom_r1cs_path: {:?}", circom_r1cs_path);

    // let output_path = args().nth(2).unwrap();
    println!("output_path: {:?}", output_path);

    // let num_pub_inputs = args().nth(3).unwrap().parse::<usize>().unwrap();
    println!("num_pub_inputs: {}", num_pub_inputs);

    // let root = current_dir().unwrap();
    // let circom_r1cs_path = root.join(circom_r1cs_path);
    // println!("circom_r1cs_path: {:?}", circom_r1cs_path);

    let spartan_inst = load_as_spartan_inst(circom_r1cs_path, num_pub_inputs);
    let sparta_inst_bytes = bincode::serialize(&spartan_inst).unwrap();

    File::create(&output_path)
        .expect("file has to be created for spartan program")
        .write_all(sparta_inst_bytes.as_slice())
        .expect("spartan program has to be written");

    println!("Success writing spartan circuit to {:?}", output_path);
}

pub fn load_as_spartan_inst(circuit_path: &PathBuf, num_pub_inputs: usize) -> Instance {
    let (r1cs, _) = load_r1cs_from_bin_file::<AffinePoint>(&circuit_path);
    let spartan_inst = convert_to_spartan_r1cs(&r1cs, num_pub_inputs);
    spartan_inst
}

fn convert_to_spartan_r1cs<F: PrimeField<Repr = FieldBytes>>(
    r1cs: &R1CS<F>,
    num_pub_inputs: usize,
) -> Instance {
    let num_cons = r1cs.constraints.len();
    let num_vars = r1cs.num_variables;
    let num_inputs = num_pub_inputs;

    let mut A = vec![];
    let mut B = vec![];
    let mut C = vec![];

    println!("111 {}", num_cons);

    for (i, constraint) in r1cs.constraints.iter().enumerate() {
        // println!("i: {}", i);
        let (a, b, c) = constraint;

        for (j, coeff) in a.iter() {
            let bytes: [u8; 32] = coeff.to_repr().into();

            A.push((i, *j, bytes));
        }

        for (j, coeff) in b.iter() {
            let bytes: [u8; 32] = coeff.to_repr().into();
            B.push((i, *j, bytes));
        }

        for (j, coeff) in c.iter() {
            let bytes: [u8; 32] = coeff.to_repr().into();
            C.push((i, *j, bytes));
        }
    }

    println!("11");

    let inst = Instance::new(
        num_cons,
        num_vars,
        num_inputs,
        A.as_slice(),
        B.as_slice(),
        C.as_slice(),
    )
    .unwrap();

    inst
}
