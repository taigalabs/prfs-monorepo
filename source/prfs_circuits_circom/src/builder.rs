use crate::paths::PATHS;
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, io::Write, path::PathBuf, process::Command};

#[derive(Serialize, Deserialize)]
pub struct AssetsJson {
    pub files: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Circuit {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
}

pub fn run() {
    println!("build");
}

fn make_spartan(circuit: &Circuit) -> PathBuf {
    let build_path = PATHS.circuits_build.join(&circuit.name);
    let circuit_r1cs_path = build_path.join(format!("{}.r1cs", &circuit.name));
    let circuit_dest_path = build_path.join(format!("{}_spartan.circuit", circuit.name));

    circuit_reader::make_spartan_instance(
        &circuit_r1cs_path,
        &circuit_dest_path,
        circuit.num_public_inputs,
    );

    circuit_dest_path
}

fn read_compile_json() -> Vec<Circuit> {
    let compile_json_path = PATHS.prfs_circuits_circom.join("compile.json");
    println!("Read compile.json path: {:?}", compile_json_path);

    compile_json_path.try_exists().unwrap();

    let bytes = std::fs::read(compile_json_path).unwrap();
    let compile_json: Vec<Circuit> = serde_json::from_slice(&bytes).unwrap();

    return compile_json;
}

fn clean_build() {
    if PATHS.circuits_build.exists() {
        std::fs::remove_dir_all(&PATHS.circuits_build).unwrap();
    }
}

fn compile_circuits(circuit: &Circuit) {
    let circuit_src_path = PATHS.prfs_circuits_circom.join(&circuit.instance_path);
    println!("circuit_src_path: {:?}", circuit_src_path);

    let build_path = PATHS.circuits_build.join(&circuit.name);
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

fn copy_assets(circuit: &Circuit, timestamp: &String, circuit_spartan_path: &PathBuf) {
    let build_path = PATHS.circuits_build.join(&circuit.name);
    let circuit_dest_path = PATHS
        .prf_asset_server_assets_local
        .join(format!("{}_{}.circuit", circuit.name, timestamp));

    println!(
        "{} a file from src: {:?}, dst: {:?}",
        "Copying".green(),
        circuit_spartan_path,
        circuit_dest_path,
    );

    fs::copy(&circuit_spartan_path, &circuit_dest_path).unwrap();

    let wtns_gen_src_path = build_path.join(format!("{}_js/{}.wasm", circuit.name, circuit.name));
    let wtns_gen_dest_path = PATHS
        .prf_asset_server_assets_local
        .join(format!("{}_{}.wasm", circuit.name, timestamp));

    println!(
        "{} a file, src: {:?}, dst: {:?}",
        "Copying".green(),
        wtns_gen_src_path,
        wtns_gen_dest_path,
    );

    fs::copy(&wtns_gen_src_path, &wtns_gen_dest_path).unwrap();

    create_assets_json(&circuit_dest_path, &wtns_gen_dest_path);
}

fn create_assets_json(circuit_path: &PathBuf, wtns_gen_path: &PathBuf) {
    let files = vec![
        circuit_path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string(),
        wtns_gen_path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string(),
    ];

    let assets_json = AssetsJson { files };

    let assets_json_path = PATHS.prf_asset_server_assets_local.join("assets.json");
    println!(
        "{} a file, path: {:?}",
        "Creating".green(),
        assets_json_path
    );

    let mut fd = std::fs::File::create(&assets_json_path).unwrap();
    let assets_json_str = serde_json::to_string_pretty(&assets_json).unwrap();
    fd.write_all(&assets_json_str.into_bytes()).unwrap();
}
