use chrono::{DateTime, Utc};
use colored::Colorize;
use prfs_circuit_interface::circuit_types::CircuitTypeId;
use prfs_crypto::hex;
use prfs_crypto::rand_utils::rand256_hex;
use prfs_crypto::sha2::{Digest, Sha256};
use prfs_driver_interface::CircuitDriverId;
use prfs_entities::entities::{PrfsCircuit, RawCircuitInputMeta};
use std::collections::HashMap;
use std::{io::Write, path::PathBuf, process::Command};

use crate::builder::create_digest;
use crate::resolve_path::get_path_segment;
use crate::{paths::PATHS, CircuitBuild, CircuitBuildJson, FileKind};

pub fn run() {
    println!("{} building {}", "Start".green(), env!("CARGO_PKG_NAME"),);
    clean_build();

    let now = Utc::now();
    let mut circuits = read_circuits_json();

    let mut circuit_map = HashMap::new();
    for mut circuit in &mut circuits {
        circuit_type_id_should_match_file_stem(&circuit);
        compile_circuits(&circuit);

        let digest = create_digest(circuit);
        circuit.circuit_id = digest[..10].to_string();

        copy_wtns_gen_file(circuit);
        let r1cs_src_path = make_spartan(&mut circuit);
        create_circuit_json(&mut circuit);

        circuit_map.insert(
            circuit.circuit_type_id.clone(),
            CircuitBuild {
                circuit_id: circuit.circuit_id.to_string(),
                circuit_type_id: circuit.circuit_type_id.clone(),
                r1cs_src_path: r1cs_src_path
                    .strip_prefix(&PATHS.build)
                    .unwrap()
                    .to_string_lossy()
                    .to_string(),
                file_hash: digest,
            },
        );
    }

    create_build_json(&circuit_map);
    create_built_at(&now);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn circuit_type_id_should_match_file_stem(circuit: &PrfsCircuit) {
    let instance_path = &circuit.build_properties.get("instance_path").unwrap();
    let circuit_src_path = PATHS.circuits.join(&instance_path);
    let file_stem = circuit_src_path
        .file_stem()
        .unwrap()
        .to_os_string()
        .into_string()
        .unwrap();

    assert_eq!(circuit.circuit_type_id.to_string(), file_stem);
}

fn copy_wtns_gen_file(circuit: &mut PrfsCircuit) {
    let wtns_gen_path = PATHS
        .build
        .join(get_path_segment(circuit, FileKind::WtnsGen));

    let wtns_gen_renamed_path = PATHS
        .build
        .join(get_path_segment(circuit, FileKind::WtnsGenRenamed));

    std::fs::copy(wtns_gen_path, wtns_gen_renamed_path).unwrap();
}

fn make_spartan(circuit: &mut PrfsCircuit) -> PathBuf {
    let raw_public_inputs: Vec<&RawCircuitInputMeta> = circuit
        .raw_circuit_inputs_meta
        .iter()
        .filter(|raw_input| return raw_input.public)
        .collect();

    println!(
        "Public input counts from 'raw_public_inputs': {}",
        raw_public_inputs.len()
    );

    circuit.num_public_inputs = raw_public_inputs.len() as i16;

    let r1cs_src_path = PATHS.build.join(get_path_segment(circuit, FileKind::R1CS));

    let spartan_circuit_path = PATHS
        .build
        .join(get_path_segment(circuit, FileKind::Spartan));

    circuit_reader::make_spartan_instance(
        &r1cs_src_path,
        &spartan_circuit_path,
        circuit.num_public_inputs as usize,
    );

    return r1cs_src_path;
}

fn read_circuits_json() -> Vec<PrfsCircuit> {
    let circuits_json_path = PATHS.data.join("json_bindings/circuits.json");
    println!("Read circuits.json path: {:?}", circuits_json_path);

    circuits_json_path.try_exists().unwrap();

    let bytes = std::fs::read(circuits_json_path).unwrap();
    let circuits: Vec<PrfsCircuit> = serde_json::from_slice(&bytes).unwrap();

    return circuits;
}

fn compile_circuits(circuit: &PrfsCircuit) {
    let circuit_driver_id = &circuit.circuit_driver_id;

    match circuit_driver_id {
        CircuitDriverId::spartan_circom_v1 => {
            let instance_path = &circuit.build_properties.get("instance_path").unwrap();

            let circuit_src_path = PATHS.circuits.join(&instance_path);
            println!("circuit_src_path: {:?}", circuit_src_path);

            let build_path = PATHS.build.join(&circuit.circuit_type_id.to_string());
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
        _ => panic!(
            "We cannot compile a circuit of this type, driver: {:?}",
            circuit_driver_id,
        ),
    };
}

fn create_circuit_json(circuit: &mut PrfsCircuit) {
    let wtns_gen_renamed_path = get_path_segment(&circuit, FileKind::WtnsGenRenamed);
    let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan);

    let wtns_gen_len = circuit.driver_properties.get_mut("wtns_gen_len").unwrap();
    let wtns_gen_bytes = std::fs::read(PATHS.build.join(&wtns_gen_renamed_path)).unwrap();
    *wtns_gen_len = wtns_gen_bytes.len().to_string();

    let circuit_len = circuit.driver_properties.get_mut("circuit_len").unwrap();
    let circuit_bytes = std::fs::read(PATHS.build.join(&spartan_circuit_path)).unwrap();
    *circuit_len = circuit_bytes.len().to_string();

    let wtns_gen_url = circuit.driver_properties.get_mut("wtns_gen_url").unwrap();
    *wtns_gen_url = format!("prfs://{}", wtns_gen_renamed_path);

    let circuit_url = circuit.driver_properties.get_mut("circuit_url").unwrap();
    *circuit_url = format!("prfs://{}", spartan_circuit_path);

    let circuit_json_path = PATHS
        .build
        .join(format!("{}/circuit.json", circuit.circuit_type_id));
    let mut fd = std::fs::File::create(&circuit_json_path).unwrap();
    let circuit_json_str = serde_json::to_string_pretty(&circuit).unwrap();
    fd.write_all(&circuit_json_str.into_bytes()).unwrap();

    println!(
        "{} build.json, path: {:?}, build_json: {:#?}",
        "Created".green(),
        circuit_json_path,
        circuit,
    );
}

fn create_build_json(circuits_json: &HashMap<CircuitTypeId, CircuitBuild>) {
    let build_json = CircuitBuildJson {
        circuits: circuits_json.clone(),
    };

    let build_json_path = PATHS.build.join("build.json");
    let mut fd = std::fs::File::create(&build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();

    println!("{} build list, path: {:?}", "Created".green(), build_json);
}

fn create_built_at(now: &DateTime<Utc>) {
    let timestamp = now.to_rfc3339();
    let path = PATHS.build.join("built_at");
    let mut fd = std::fs::File::create(&path).unwrap();

    write!(fd, "{}", &timestamp).unwrap();
}
