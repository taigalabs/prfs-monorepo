use std::{env, fs, path::PathBuf, process::Command};

pub fn compile_circuits() {
    let curr_dir = env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let circuit_name = "addr_membership2";
    let num_pub_inputs = 5;

    let circuit_build_path = curr_dir.join(format!("source/prfs_circuits/build/{}", circuit_name));
    println!("circuit_build_path: {:?}", circuit_build_path);
    std::fs::create_dir_all(&circuit_build_path).unwrap();

    let circuit_path = curr_dir.join(format!(
        "source/prfs_circuits/instances/{}.circom",
        circuit_name
    ));
    println!("circuit_path: {:?}", circuit_path);

    let status = Command::new("circom-secq")
        .args([
            circuit_path.to_str().unwrap(),
            "--r1cs",
            "--wasm",
            "--prime",
            "secq256k1",
            "-o",
            circuit_build_path.to_str().unwrap(),
        ])
        .status()
        .expect("circom-secq command failed to start");

    assert!(status.success());

    let circuit_r1cs_path = circuit_build_path.join(format!("{}.r1cs", circuit_name));
    let circuit_compiled_path = circuit_build_path.join(format!("{}.circuit", circuit_name));

    let status = Command::new("cargo")
        .args([
            "run",
            "--release",
            "--bin",
            "gen_spartan_inst",
            circuit_r1cs_path.to_str().unwrap(),
            circuit_compiled_path.to_str().unwrap(),
            &num_pub_inputs.to_string(),
        ])
        .status()
        .expect("cargo command failed to start");

    assert!(status.success());
}
