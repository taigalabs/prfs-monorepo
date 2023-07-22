use crate::paths::PATHS;
use chrono::Utc;
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{io::Write, path::PathBuf, process::Command};

pub enum FileKind {
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize)]
pub struct BuildJson {
    pub timestamp: String,
    pub circuit_builds: Vec<CircuitBuildJson>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitBuildJson {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
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

    let circuits = read_circuits_json();
    for circuit in &circuits {
        compile_circuits(&circuit);

        make_spartan(&circuit);
        // let wtns_gen_path = build_path.join(format!("{}_js/{}.wasm", circuit.name, circuit.name));
        // let spartan_circuit_path = circuit_spartan_path.to_str().unwrap().to_string();
        // let wtns_gen_path = wtns_gen_path.to_str().unwrap().to_string();
    }

    create_build_json(circuits, timestamp);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn get_path_segment(circuit: &CircuitJson, file_kind: FileKind) -> String {
    let r1cs_path_segment = format!("{}/{}.r1cs", &circuit.name, &circuit.name,);
    let spartan_circuit_path_segment = format!("{}/{}_spartan.circuit", circuit.name, circuit.name);
    let wtns_gen_path_segment =
        format!("{}/{}_js/{}.wasm", circuit.name, circuit.name, circuit.name);

    match file_kind {
        FileKind::R1CS => r1cs_path_segment,
        FileKind::Spartan => spartan_circuit_path_segment,
        FileKind::WtnsGen => wtns_gen_path_segment,
    }
}

fn make_spartan(circuit: &CircuitJson) {
    let r1cs_src_path = PATHS.build.join(get_path_segment(circuit, FileKind::R1CS));
    let spartan_circuit_path = PATHS
        .build
        .join(get_path_segment(circuit, FileKind::Spartan));

    circuit_reader::make_spartan_instance(
        &r1cs_src_path,
        &spartan_circuit_path,
        circuit.num_public_inputs,
    );
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

fn create_build_json(circuits: Vec<CircuitJson>, timestamp: String) {
    let mut circuit_builds = vec![];
    for circuit in circuits {
        let wtns_gen_path = get_path_segment(&circuit, FileKind::WtnsGen);
        let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan);

        let circuit_build_json = CircuitBuildJson {
            name: circuit.name,
            num_public_inputs: circuit.num_public_inputs,
            instance_path: circuit.instance_path,
            wtns_gen_path,
            spartan_circuit_path,
        };
        circuit_builds.push(circuit_build_json);
    }

    let build_json = BuildJson {
        timestamp,
        circuit_builds,
    };

    let build_json_path = PATHS.build.join("build.json");
    let mut fd = std::fs::File::create(&build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();
}
