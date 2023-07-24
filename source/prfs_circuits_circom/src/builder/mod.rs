mod json;

use crate::paths::PATHS;
use chrono::Utc;
use colored::Colorize;
pub use json::*;
use std::{collections::HashMap, io::Write, process::Command};

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

    let circuits_json = read_circuits_json();

    for (_name, circuit) in &circuits_json.circuits {
        compile_circuits(&circuit);
        make_spartan(&circuit, &timestamp);
        copy_instance(&circuit);
    }

    create_build_json(&circuits_json, &timestamp);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn get_path_segment(circuit: &CircuitDetail, file_kind: FileKind, timestamp: &String) -> String {
    let r1cs_path_segment = format!("{}/{}.r1cs", &circuit.name, &circuit.name,);
    let spartan_circuit_path_segment = format!(
        "{}/{}_{}.spartan.circuit",
        circuit.name, circuit.name, timestamp
    );
    let wtns_gen_path_segment =
        format!("{}/{}_js/{}.wasm", circuit.name, circuit.name, circuit.name,);

    match file_kind {
        FileKind::R1CS => r1cs_path_segment,
        FileKind::Spartan => spartan_circuit_path_segment,
        FileKind::WtnsGen => wtns_gen_path_segment,
    }
}

fn make_spartan(circuit: &CircuitDetail, timestamp: &String) {
    let r1cs_src_path = PATHS
        .build
        .join(get_path_segment(circuit, FileKind::R1CS, timestamp));
    let spartan_circuit_path =
        PATHS
            .build
            .join(get_path_segment(circuit, FileKind::Spartan, timestamp));

    circuit_reader::make_spartan_instance(
        &r1cs_src_path,
        &spartan_circuit_path,
        circuit.num_public_inputs,
    );
}

fn read_circuits_json() -> CircuitsJson {
    let circuits_json_path = PATHS.circuits.join("circuits.json");
    println!("Read circuits.json path: {:?}", circuits_json_path);

    circuits_json_path.try_exists().unwrap();

    let bytes = std::fs::read(circuits_json_path).unwrap();
    let circuits: CircuitsJson = serde_json::from_slice(&bytes).unwrap();

    return circuits;
}

fn compile_circuits(circuit: &CircuitDetail) {
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

fn create_build_json(circuits_json: &CircuitsJson, timestamp: &String) {
    let mut circuit_builds = HashMap::new();
    for (name, circuit) in &circuits_json.circuits {
        let wtns_gen_path = get_path_segment(&circuit, FileKind::WtnsGen, timestamp);
        let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan, timestamp);

        let circuit_build_json = CircuitBuildDetail {
            name: circuit.name.to_string(),
            author: circuit.author.to_string(),
            num_public_inputs: circuit.num_public_inputs,
            instance_path: format!("{}/{}", circuit.name, circuit.instance_path),
            wtns_gen_path,
            spartan_circuit_path,
        };

        circuit_builds.insert(name.to_string(), circuit_build_json);
    }

    let build_json = BuildJson {
        timestamp: timestamp.to_string(),
        circuit_builds,
    };

    let build_json_path = PATHS.build.join("build.json");
    let mut fd = std::fs::File::create(&build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();
}

fn copy_instance(circuit: &CircuitDetail) {
    let circuit_src_path = PATHS.circuits.join(&circuit.instance_path);
    let file_name = circuit_src_path.file_name().unwrap();

    let dest_dir = PATHS.build.join(format!("{}/src/", &circuit.name));
    std::fs::create_dir_all(&dest_dir).unwrap();

    // let dest_path = dest_dir.join("")
}
