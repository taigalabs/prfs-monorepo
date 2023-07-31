mod build_json;
mod circuit_json;

use crate::paths::PATHS;
pub use build_json::*;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
pub use circuit_json::*;
use colored::Colorize;
use std::{collections::HashMap, io::Write, process::Command};

pub fn run() {
    let now = Utc::now();
    let timestamp = now.timestamp_millis();

    println!(
        "{} building {}, timestamp: {}",
        "Start".green(),
        env!("CARGO_PKG_NAME"),
        timestamp
    );

    clean_build();

    let circuits_json = read_circuits_json();

    for (_label, circuit) in &circuits_json.circuits {
        compile_circuits(&circuit);
        make_spartan(&circuit, timestamp);
        copy_instance(&circuit);
        create_build_json(&circuit, timestamp);
    }

    create_list_json(&circuits_json, timestamp);
}

fn clean_build() {
    if PATHS.build.exists() {
        std::fs::remove_dir_all(&PATHS.build).unwrap();
    }
}

fn get_path_segment(circuit: &CircuitDetail, file_kind: FileKind, timestamp: i64) -> String {
    match file_kind {
        FileKind::R1CS => {
            format!("{}/{}.r1cs", &circuit.label, &circuit.label,)
        }
        FileKind::Spartan => {
            format!(
                "{}/{}_{}.spartan.circuit",
                circuit.label, circuit.label, timestamp
            )
        }
        FileKind::WtnsGen => {
            format!(
                "{}/{}_js/{}.wasm",
                circuit.label, circuit.label, circuit.label,
            )
        }
        FileKind::Source => {
            let circuit_src_path = PATHS.circuits.join(&circuit.instance_path);
            let file_name = circuit_src_path.file_name().unwrap().to_str().unwrap();

            let src_path = format!("{}/src/{}", &circuit.label, &file_name);
            src_path
        }
    }
}

fn make_spartan(circuit: &CircuitDetail, timestamp: i64) {
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
        circuit.public_inputs.len(),
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

    let build_path = PATHS.build.join(&circuit.label);
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

fn create_build_json(circuit: &CircuitDetail, timestamp: i64) {
    let wtns_gen_path = get_path_segment(&circuit, FileKind::WtnsGen, timestamp);
    let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan, timestamp);
    let circuit_src_path = get_path_segment(&circuit, FileKind::Source, timestamp);

    let naive = NaiveDateTime::from_timestamp_millis(timestamp).unwrap();
    let datetime: DateTime<Utc> = DateTime::from_utc(naive, Utc);

    let circuit_build_json = CircuitBuildJson {
        timestamp,
        circuit_id: circuit.circuit_id.to_string(),
        label: circuit.label.to_string(),
        author: circuit.author.to_string(),
        desc: circuit.desc.to_string(),
        created_at: datetime.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
        circuit_dsl: circuit.circuit_dsl.to_string(),
        arithmetization: circuit.arithmetization.to_string(),
        proof_algorithm: circuit.proof_algorithm.to_string(),
        elliptic_curve: circuit.elliptic_curve.to_string(),
        finite_field: circuit.finite_field.to_string(),
        instance_path: circuit.instance_path.to_string(),
        public_inputs: circuit.public_inputs.clone(),
        circuit_src_path,
        program: circuit.program.clone(),
        wtns_gen_url: format!("{}{}", SYSTEM_NATIVE_SCHEME, wtns_gen_path),
        spartan_circuit_url: format!("{}{}", SYSTEM_NATIVE_SCHEME, spartan_circuit_path),
    };

    let build_json_path = PATHS.build.join(format!("{}/build.json", circuit.label));
    let mut fd = std::fs::File::create(&build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&circuit_build_json).unwrap();
    fd.write_all(&build_json_str.into_bytes()).unwrap();

    println!(
        "{} build.json, path: {:?}",
        "Created".green(),
        build_json_path
    );
    // println!("{:#?}", build_json);
}

fn create_list_json(circuits_json: &CircuitsJson, timestamp: i64) {
    // let mut circuit_builds = HashMap::new();

    // for (name, circuit) in &circuits_json.circuits {
    //     let wtns_gen_path = get_path_segment(&circuit, FileKind::WtnsGen, timestamp);
    //     let spartan_circuit_path = get_path_segment(&circuit, FileKind::Spartan, timestamp);
    //     let circuit_src_path = get_path_segment(&circuit, FileKind::Source, timestamp);

    //     let naive = NaiveDateTime::from_timestamp_millis(timestamp).unwrap();
    //     let datetime: DateTime<Utc> = DateTime::from_utc(naive, Utc);

    //     let circuit_build_json = CircuitBuildDetail {
    //         circuit_id: circuit.circuit_id.to_string(),
    //         label: circuit.label.to_string(),
    //         author: circuit.author.to_string(),
    //         desc: circuit.desc.to_string(),
    //         created_at: datetime.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
    //         circuit_dsl: circuit.circuit_dsl.to_string(),
    //         arithmetization: circuit.arithmetization.to_string(),
    //         proof_algorithm: circuit.proof_algorithm.to_string(),
    //         elliptic_curve: circuit.elliptic_curve.to_string(),
    //         finite_field: circuit.finite_field.to_string(),
    //         instance_path: format!("{}/{}", circuit.label, circuit.instance_path),
    //         public_inputs: circuit.public_inputs.clone(),
    //         circuit_src_path,
    //         wtns_gen_url: format!("{}{}", SYSTEM_NATIVE_SCHEME, wtns_gen_path),
    //         spartan_circuit_url: format!("{}{}", SYSTEM_NATIVE_SCHEME, spartan_circuit_path),
    //     };

    //     circuit_builds.insert(name.to_string(), circuit_build_json);
    // }

    // let build_json_path = PATHS.build.join("build.json");
    // let mut fd = std::fs::File::create(&build_json_path).unwrap();
    // let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();
    // fd.write_all(&build_json_str.into_bytes()).unwrap();

    // println!(
    //     "{} build.json, path: {:?}",
    //     "Created".green(),
    //     build_json_path
    // );
    // println!("{:#?}", build_json);
}

fn copy_instance(circuit: &CircuitDetail) {
    let circuit_src_path = PATHS.circuits.join(&circuit.instance_path);
    let file_name = circuit_src_path.file_name().unwrap().to_str().unwrap();

    let dest_dir = PATHS.build.join(format!("{}/src/", &circuit.label));
    std::fs::create_dir_all(&dest_dir).unwrap();

    let dest_path = dest_dir.join(file_name);
    println!(
        "{} {:?} to {:?}",
        "Copying".green(),
        circuit_src_path,
        dest_path
    );

    std::fs::copy(circuit_src_path, dest_path).unwrap();
}
