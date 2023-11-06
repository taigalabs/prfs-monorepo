use crate::{driver_id, paths::PATHS, CircuitBuildListJson, CircuitsJson, FileKind};
use colored::Colorize;
use prfs_entities::entities::{PrfsCircuit, RawCircuitInputMeta};
use std::{io::Write, path::PathBuf, process::Command};

pub fn run() {
    println!("{} building {}", "Start".green(), env!("CARGO_PKG_NAME"),);

    clean_build();

    let mut circuits = read_circuits_json();

    let mut circuit_list = vec![];
    for mut circuit in &mut circuits {
        compile_circuits(&circuit);
        make_spartan(&mut circuit);
        println!("222");
        create_circuit_json(&mut circuit);

        circuit_list.push(circuit.circuit_id.to_string());
    }

    create_list_json(&circuit_list);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn get_path_segment(circuit: &PrfsCircuit, file_kind: FileKind) -> String {
    match file_kind {
        FileKind::R1CS => {
            let instance_path = &circuit.build_properties.get("instance_path").unwrap();
            let circuit_src_path = PATHS.circuits.join(&instance_path);
            let file_stem = circuit_src_path
                .file_stem()
                .unwrap()
                .to_os_string()
                .into_string()
                .unwrap();

            format!("{}/{}.r1cs", &circuit.circuit_id, file_stem)
        }
        FileKind::Spartan => {
            format!("{}/{}.spartan.circuit", circuit.circuit_id, circuit.label)
        }
        FileKind::WtnsGen => {
            format!(
                "{}/{}_js/{}.wasm",
                circuit.circuit_id, circuit.label, circuit.label,
            )
        }
    }
}

fn make_spartan(circuit: &mut PrfsCircuit) {
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

    match circuit_driver_id.as_str() {
        driver_id::SPARTAN_CIRCOM_DRIVER_ID => {
            let instance_path = &circuit.build_properties.get("instance_path").unwrap();

            let circuit_src_path = PATHS.circuits.join(&instance_path);
            println!("circuit_src_path: {:?}", circuit_src_path);

            let build_path = PATHS.build.join(&circuit.circuit_id.to_string());
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
            circuit_driver_id.as_str()
        ),
    };
}

fn create_circuit_json(circuit: &mut PrfsCircuit) {
    let wtns_gen_path = get_path_segment(&circuit, FileKind::WtnsGen);
    let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan);

    let wtns_gen_url = circuit.driver_properties.get_mut("wtns_gen_url").unwrap();
    *wtns_gen_url = format!("prfs://{}", wtns_gen_path);

    let circuit_url = circuit.driver_properties.get_mut("circuit_url").unwrap();
    *circuit_url = format!("prfs://{}", spartan_circuit_path);

    // let circuit_build_json = CircuitBuildJson {
    //     circuit: circuit.clone(),
    // };

    let circuit_json_path = PATHS
        .build
        .join(format!("{}/circuit.json", circuit.circuit_id));
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

fn create_list_json(circuits_json: &Vec<String>) {
    let build_list_json = CircuitBuildListJson {
        // circuit_version: circuit_version.to_string(),
        circuits: circuits_json.clone(),
    };

    let build_list_json_path = PATHS.build.join("list.json");
    let mut fd = std::fs::File::create(&build_list_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_list_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();

    println!(
        "{} build list, path: {:?}",
        "Created".green(),
        build_list_json_path
    );
}
