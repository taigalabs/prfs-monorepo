use crate::{build_status::BuildStatus, paths::Paths, task::Task, CiError};
use colored::Colorize;
use std::{env, fs, path::PathBuf, process::Command};

pub struct CompileCircuitsTask;

impl Task for CompileCircuitsTask {
    fn name(&self) -> &str {
        "compile_circuits"
    }

    fn run(&self, build_status: &mut BuildStatus, paths: &Paths) -> Result<(), CiError> {
        let circuit_name = "addr_membership2";
        let num_pub_inputs = 5;

        let circuit_file_name = format!("{}_{}", circuit_name, build_status.timestamp);

        let circuit_src_path = paths
            .circuits_path
            .join(format!("instances/{}.circom", circuit_name));
        println!("circuit_src_path: {:?}", circuit_src_path);

        let circuit_build_path = paths
            .circuit_build_path
            .join(format!("{}_spartan", circuit_name));
        println!("circuit_build_path: {:?}", circuit_build_path);

        compile_circuits(paths, &circuit_src_path, &circuit_build_path);

        let circuit_r1cs_path = paths
            .circuit_build_path
            .join(format!("{}.r1cs", &circuit_name));

        let circuit_compiled_path = paths
            .circuit_build_path
            .join(format!("{}_spartan.circuit", circuit_name));

        circuit_reader::make_spartan_instance(
            &circuit_r1cs_path,
            &circuit_compiled_path,
            num_pub_inputs,
        );

        copy_assets(
            build_status,
            paths,
            circuit_compiled_path,
            &circuit_name,
            &circuit_file_name,
        );

        Ok(())
    }
}

fn compile_circuits(paths: &Paths, circuit_src_path: &PathBuf, circuit_build_path: &PathBuf) {
    println!(
        "{} a direcotry, path: {:?}",
        "Creating".green(),
        circuit_build_path
    );

    std::fs::create_dir_all(&paths.circuit_build_path).unwrap();

    let status = Command::new("circom-secq")
        .args([
            circuit_src_path.to_str().unwrap(),
            "--r1cs",
            "--wasm",
            "--prime",
            "secq256k1",
            "-o",
            paths.circuit_build_path.to_str().unwrap(),
        ])
        .status()
        .expect("circom-secq command failed to start");

    assert!(status.success());
}

fn copy_assets(
    build_status: &BuildStatus,
    paths: &Paths,
    circuit_compiled_path: PathBuf,
    circuit_name: &str,
    circuit_file_name: &String,
) {
    let circuit_asset_path = paths.prf_asset_serve_path.join("circuits");
    println!(
        "{} a directory, path: {:?}",
        "Creating".green(),
        circuit_asset_path,
    );

    std::fs::create_dir_all(&circuit_asset_path).unwrap();

    let circuit_compiled_serve_path =
        circuit_asset_path.join(format!("{}.circuit", circuit_file_name,));

    println!(
        "{} a file from src: {:?}, dst: {:?}",
        "Copying".green(),
        circuit_compiled_path,
        circuit_compiled_serve_path,
    );

    fs::copy(circuit_compiled_path, circuit_compiled_serve_path).unwrap();

    let wtns_gen_src_path = paths
        .circuit_build_path
        .join(format!("{}_js/{}.wasm", circuit_name, circuit_name));

    let wtns_gen_serve_path = circuit_asset_path.join(format!("{}.wasm", circuit_file_name));

    println!(
        "{} a file, src: {:?}, dst: {:?}",
        "Copying".green(),
        wtns_gen_src_path,
        wtns_gen_serve_path,
    );

    fs::copy(wtns_gen_src_path, wtns_gen_serve_path).unwrap();
}
