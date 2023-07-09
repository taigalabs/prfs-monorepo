use crate::{build_status::BuildStatus, paths::Paths, task::Task, CiError};
use std::{env, fs, process::Command};

pub struct CompileCircuitsTask;

impl Task for CompileCircuitsTask {
    fn name(&self) -> &str {
        "compile_circuits"
    }

    fn run(&self, build_status: &mut BuildStatus, paths: &Paths) -> Result<(), CiError> {
        println!("\nCompiling circuits...");

        let circuit_name = "addr_membership2";
        let num_pub_inputs = 5;

        let circuit_build_path = paths.circuit_build_path.join(format!("{}", circuit_name));
        println!("Creating a circuit build path: {:?}", circuit_build_path);

        std::fs::create_dir_all(&paths.circuit_build_path).unwrap();

        let circuit_path = paths
            .circuits_path
            .join(format!("instances/{}.circom", circuit_name));
        println!("circuit_path: {:?}", circuit_path);

        let status = Command::new("circom-secq")
            .args([
                circuit_path.to_str().unwrap(),
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

        let circuit_r1cs_path = paths
            .circuit_build_path
            .join(format!("{}.r1cs", circuit_name));

        let circuit_compiled_path = paths
            .circuit_build_path
            .join(format!("{}.circuit", circuit_name));

        let status = Command::new("cargo")
            .args([
                "run",
                "--release",
                "--bin",
                "gen_spartan_inst",
                circuit_r1cs_path.to_str().unwrap(),
                circuit_compiled_path.to_str().unwrap(),
                &num_pub_inputs.to_string(),
            ])
            .status()
            .expect("cargo command failed to start");

        assert!(status.success());

        let circuit_compiled_serve_path = paths
            .prf_asset_serve_path
            .join(format!("{}.circuit", circuit_name,));

        println!(
            "circuit_compiled_serve_path: {:?}",
            circuit_compiled_serve_path
        );

        fs::copy(circuit_compiled_path, circuit_compiled_serve_path).unwrap();

        let wtns_gen_path = paths
            .circuit_build_path
            .join(format!("{}_js/{}.wasm", circuit_name, circuit_name));
        println!("wtns_gen_path: {:?}", wtns_gen_path);

        let wtns_gen_serve_path = paths
            .prf_asset_serve_path
            .join(format!("{}.wasm", circuit_name,));
        println!("wtns_gen_serve_path: {:?}", wtns_gen_serve_path);

        fs::copy(wtns_gen_path, wtns_gen_serve_path).unwrap();

        Ok(())
    }
}
