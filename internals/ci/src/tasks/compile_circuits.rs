use crate::{paths::PATHS, task::Task, BuildHandle, CiError};
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, io::Write, path::PathBuf, process::Command};

pub struct CompileCircuitsTask;

#[derive(Serialize, Deserialize)]
pub struct BuildCircuitJson {
    pub timestamp: String,
    pub files: HashMap<String, String>,
}

#[derive(Serialize, Deserialize)]
pub struct Circuit {
    pub name: String,
    pub instance_path: String,
    pub num_pub_inputs: usize,
}

impl Task for CompileCircuitsTask {
    fn name(&self) -> &str {
        "compile_circuits"
    }

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError> {
        clean_build();

        let compile_json = read_compile_json();

        for circuit in compile_json {
            // let circuit_id = format!("{}_{}", circuit.name, build_handle.timestamp);

            compile_circuits(&circuit, &build_handle.timestamp);

            create_local_server_asset_path();

            // let circuit_file_name = format!("{}.circuit", circuit_id,);
            // let circuit_compiled_serve_path =
            //     PATHS.prf_asset_server_assets_local.join(&circuit_file_name);

            // let wtns_gen_src_path = PATHS
            //     .circuits_build
            //     .join(format!("{}_js/{}.wasm", circuit.name, circuit.name));
            // let wtns_gen_file_name = format!("{}.wasm", circuit_id);

            // let wtns_gen_serve_path = PATHS
            //     .prf_asset_server_assets_local
            //     .join(&wtns_gen_file_name);
            //
            make_spartan(&circuit);

            // circuit_reader::make_spartan_instance(
            //     &circuit_r1cs_path,
            //     &circuit_compiled_path,
            //     circuit.num_pub_inputs,
            // );
        }

        // copy_assets(
        //     build_handle,
        //     circuit_compiled_path,
        //     &circuit_compiled_serve_path,
        //     &wtns_gen_src_path,
        //     &wtns_gen_serve_path,
        // );

        // create_build_json(build_handle, &circuit_file_name, &wtns_gen_file_name);

        Ok(())
    }
}

fn create_local_server_asset_path() {
    let local_server_asset_path = &PATHS.prf_asset_server_assets_local;

    println!(
        "{} a directory, path: {:?}",
        "Recreating".green(),
        local_server_asset_path,
    );

    if local_server_asset_path.exists() {
        std::fs::remove_dir_all(&local_server_asset_path).unwrap();
    }
    std::fs::create_dir_all(&local_server_asset_path).unwrap();
}

fn make_spartan(circuit: &Circuit) {
    let circuit_r1cs_path = PATHS.circuits_build.join(format!("{}.r1cs", &circuit.name));
    let circuit_compiled_path = PATHS
        .circuits_build
        .join(format!("{}_spartan.circuit", circuit.name));

    circuit_reader::make_spartan_instance(
        &circuit_r1cs_path,
        &circuit_compiled_path,
        circuit.num_pub_inputs,
    );
}

fn read_compile_json() -> Vec<Circuit> {
    let compile_json_path = PATHS.prfs_circuits.join("compile.json");

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

fn compile_circuits(circuit: &Circuit, timestamp: &String) {
    let circuit_src_path = PATHS.prfs_circuits.join(&circuit.instance_path);
    println!("circuit_src_path: {:?}", circuit_src_path);

    let circuit_dest_path = PATHS
        .circuits_build
        .join(format!("{}_{}.circuit", circuit.name, timestamp));
    println!("circuit_dest_path: {:?}", circuit_dest_path);

    println!(
        "{} a direcotry, path: {:?}",
        "Creating".green(),
        circuit_dest_path
    );

    std::fs::create_dir_all(&PATHS.circuits_build).unwrap();

    let status = Command::new("circom-secq")
        .args([
            circuit_src_path.to_str().unwrap(),
            "--r1cs",
            "--wasm",
            "--prime",
            "secq256k1",
            "-o",
            PATHS.circuits_build.to_str().unwrap(),
        ])
        .status()
        .expect("circom-secq command failed to start");

    assert!(status.success());
}

fn copy_assets(
    _build_handle: &BuildHandle,
    circuit_compiled_path: PathBuf,
    circuit_compiled_serve_path: &PathBuf,
    wtns_gen_src_path: &PathBuf,
    wtns_gen_serve_path: &PathBuf,
) {
    println!(
        "{} a file from src: {:?}, dst: {:?}",
        "Copying".green(),
        circuit_compiled_path,
        circuit_compiled_serve_path,
    );

    fs::copy(circuit_compiled_path, circuit_compiled_serve_path).unwrap();

    println!(
        "{} a file, src: {:?}, dst: {:?}",
        "Copying".green(),
        wtns_gen_src_path,
        wtns_gen_serve_path,
    );

    fs::copy(wtns_gen_src_path, wtns_gen_serve_path).unwrap();
}

fn create_build_json(
    build_handle: &BuildHandle,
    circuit_file_name: &String,
    wtns_gen_file_name: &String,
) {
    let files = HashMap::from([
        (
            String::from("addr_membership2_circuit"),
            format!("{}", circuit_file_name),
        ),
        (
            String::from("addr_membership2_wtns_gen"),
            format!("{}", wtns_gen_file_name),
        ),
    ]);

    let build_json = BuildCircuitJson {
        timestamp: build_handle.timestamp.to_string(),
        files,
    };

    let circuit_build_json_path = PATHS.prf_asset_server_assets_local.join("build.json");
    println!(
        "{} a file, path: {:?}",
        "Recreating".green(),
        circuit_build_json_path
    );

    if circuit_build_json_path.exists() {
        std::fs::remove_file(&circuit_build_json_path).unwrap();
    }

    let mut fd = std::fs::File::create(&circuit_build_json_path).unwrap();
    let build_json_str = serde_json::to_string_pretty(&build_json).unwrap();

    fd.write_all(&build_json_str.into_bytes()).unwrap();
}
