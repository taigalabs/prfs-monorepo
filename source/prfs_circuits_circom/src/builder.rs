use crate::paths::PATHS;
use chrono::Utc;
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{fs, io::Write, path::PathBuf, process::Command};

#[derive(Serialize, Deserialize)]
pub struct BuildJson {
    pub timestamp: String,
    pub circuits: Vec<CircuitBuildJson>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitBuildJson {
    pub circuit: CircuitJson,
    pub wtns_gen_path: String,
    pub spartan_circuit_path: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitJson {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
}

pub fn run() {
    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();

    println!(
        "{} building {}, timestamp: {}",
        "Start".green(),
        env!("CARGO_PKG_NAME"),
        timestamp
    );

    clean_build();

    let mut circuit_builds = vec![];
    let circuits = read_circuits_json();
    for circuit in &circuits {
        compile_circuits(&circuit);

        let (circuit_spartan_path, wtns_gen_path) = make_spartan(&circuit);
        let spartan_circuit_path = circuit_spartan_path.to_str().unwrap().to_string();
        let wtns_gen_path = wtns_gen_path.to_str().unwrap().to_string();

        let circuit_build_json = CircuitBuildJson {
            circuit: circuit.clone(),
            wtns_gen_path,
            spartan_circuit_path,
        };
        circuit_builds.push(circuit_build_json);
    }

    create_build_json(circuit_builds, timestamp);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn make_spartan(circuit: &CircuitJson) -> (PathBuf, PathBuf) {
    let build_path = PATHS.build.join(&circuit.name);
    let r1cs_src_path = build_path.join(format!("{}.r1cs", &circuit.name));
    let spartan_circuit_path = build_path.join(format!("{}_spartan.circuit", circuit.name));

    let wtns_gen_path = build_path.join(format!("{}_js/{}.wasm", circuit.name, circuit.name));

    circuit_reader::make_spartan_instance(
        &r1cs_src_path,
        &spartan_circuit_path,
        circuit.num_public_inputs,
    );

    (spartan_circuit_path, wtns_gen_path)
}

fn read_circuits_json() -> Vec<CircuitJson> {
    let circuits_json_path = PATHS.circuits.join("circuits.json");
    println!("Read circuits.json path: {:?}", circuits_json_path);

    circuits_json_path.try_exists().unwrap();

    let bytes = std::fs::read(circuits_json_path).unwrap();
    let circuits: Vec<CircuitJson> = serde_json::from_slice(&bytes).unwrap();

    return circuits;
}

fn compile_circuits(circuit: &CircuitJson) {
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

fn create_build_json(circuits: Vec<CircuitBuildJson>, timestamp: String) {
    let build_json_path = PATHS.build.join("build.json");

    let build_json = BuildJson {
        timestamp,
        circuits,
    };

    let mut fd = std::fs::File::create(&build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();
}
