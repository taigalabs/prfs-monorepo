use crate::paths::PATHS;
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{fs, io::Write, path::PathBuf, process::Command};

#[derive(Serialize, Deserialize)]
pub struct BuildJson {
    // pub files: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Circuit {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
}

pub fn run() {
    println!("build");

    clean_build();

    let circuits = read_circuits_json();

    for circuit in &circuits {
        compile_circuits(&circuit);
        let circuit_spartan_path = make_spartan(&circuit);
    }

    create_build_json(&circuits);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn make_spartan(circuit: &Circuit) -> PathBuf {
    let build_path = PATHS.build.join(&circuit.name);
    let r1cs_src_path = build_path.join(format!("{}.r1cs", &circuit.name));
    let output_path = build_path.join(format!("{}_spartan.circuit", circuit.name));

    circuit_reader::make_spartan_instance(&r1cs_src_path, &output_path, circuit.num_public_inputs);

    output_path
}

fn read_circuits_json() -> Vec<Circuit> {
    let circuits_json_path = PATHS.circuits.join("circuits.json");
    println!("Read circuits.json path: {:?}", circuits_json_path);

    circuits_json_path.try_exists().unwrap();

    let bytes = std::fs::read(circuits_json_path).unwrap();
    let circuits: Vec<Circuit> = serde_json::from_slice(&bytes).unwrap();

    return circuits;
}

fn compile_circuits(circuit: &Circuit) {
    let circuit_src_path = PATHS.circuits.join(&circuit.instance_path);
    println!("circuit_src_path: {:?}", circuit_src_path);

    let build_path = PATHS.build.join(&circuit.name);
    println!("circuit_build_path: {:?}", build_path);

    std::fs::create_dir_all(&build_path).unwrap();

    let status = Command::new("circom-secq")
        .args([
            circuit_src_path.to_str().unwrap(),
            "--r1cs",
            "--wasm",
            "--prime",
            "secq256k1",
            "-o",
            build_path.to_str().unwrap(),
        ])
        .status()
        .expect("circom-secq command failed to start");

    assert!(status.success());
}

fn create_build_json(circuits: &Vec<Circuit>) {
    // let files = vec![
    //     circuit_path
    //         .file_name()
    //         .unwrap()
    //         .to_str()
    //         .unwrap()
    //         .to_string(),
    //     wtns_gen_path
    //         .file_name()
    //         .unwrap()
    //         .to_str()
    //         .unwrap()
    //         .to_string(),
    // ];

    // let assets_json = AssetsJson { files };

    // let assets_json_path = PATHS.prf_asset_server_assets_local.join("assets.json");
    // println!(
    //     "{} a file, path: {:?}",
    //     "Creating".green(),
    //     assets_json_path
    // );

    // let mut fd = std::fs::File::create(&assets_json_path).unwrap();
    // let assets_json_str = serde_json::to_string_pretty(&assets_json).unwrap();
    // fd.write_all(&assets_json_str.into_bytes()).unwrap();
}
