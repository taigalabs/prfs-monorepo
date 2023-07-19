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

impl Task for CompileCircuitsTask {
    fn name(&self) -> &str {
        "compile_circuits"
    }

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let circuit_name = "addr_membership2";
        let num_pub_inputs = 5;

        let circuit_id = format!("{}_{}", circuit_name, build_handle.timestamp);

        let circuit_src_path = PATHS
            .circuits_path
            .join(format!("instances/{}.circom", circuit_name));
        println!("circuit_src_path: {:?}", circuit_src_path);

        let circuit_build_path = PATHS
            .circuit_build_path
            .join(format!("{}.circuit", circuit_name));
        println!("circuit_build_path: {:?}", circuit_build_path);

        compile_circuits(&circuit_src_path, &circuit_build_path);

        let circuit_r1cs_path = PATHS
            .circuit_build_path
            .join(format!("{}.r1cs", &circuit_name));

        let asset_local_path = PATHS.prf_asset_serve_path.join("local");

        create_circuit_asset_path(&asset_local_path);

        let circuit_compiled_path = PATHS
            .circuit_build_path
            .join(format!("{}_spartan.circuit", circuit_name));
        let circuit_file_name = format!("{}.circuit", circuit_id,);
        let circuit_compiled_serve_path = asset_local_path.join(&circuit_file_name);

        let wtns_gen_src_path = PATHS
            .circuit_build_path
            .join(format!("{}_js/{}.wasm", circuit_name, circuit_name));
        let wtns_gen_file_name = format!("{}.wasm", circuit_id);

        let wtns_gen_serve_path = asset_local_path.join(&wtns_gen_file_name);

        circuit_reader::make_spartan_instance(
            &circuit_r1cs_path,
            &circuit_compiled_path,
            num_pub_inputs,
        );

        copy_assets(
            build_handle,
            circuit_compiled_path,
            &circuit_compiled_serve_path,
            &wtns_gen_src_path,
            &wtns_gen_serve_path,
        );

        create_build_json(
            build_handle,
            &asset_local_path,
            &circuit_file_name,
            &wtns_gen_file_name,
        );

        Ok(())
    }
}

fn create_circuit_asset_path(circuit_asset_path: &PathBuf) {
    println!(
        "{} a directory, path: {:?}",
        "Recreating".green(),
        circuit_asset_path,
    );

    if circuit_asset_path.exists() {
        std::fs::remove_dir_all(&circuit_asset_path).unwrap();
    }
    std::fs::create_dir_all(&circuit_asset_path).unwrap();
}

fn compile_circuits(circuit_src_path: &PathBuf, circuit_build_path: &PathBuf) {
    println!(
        "{} a direcotry, path: {:?}",
        "Creating".green(),
        circuit_build_path
    );

    std::fs::create_dir_all(&PATHS.circuit_build_path).unwrap();

    let status = Command::new("circom-secq")
        .args([
            circuit_src_path.to_str().unwrap(),
            "--r1cs",
            "--wasm",
            "--prime",
            "secq256k1",
            "-o",
            PATHS.circuit_build_path.to_str().unwrap(),
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
    asset_local_path: &PathBuf,
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

    let circuit_build_json_path = asset_local_path.join("build.json");
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
