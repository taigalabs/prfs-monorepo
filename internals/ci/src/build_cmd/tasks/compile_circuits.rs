use super::task::BuildTask;
use crate::{deps, paths::PATHS, BuildHandle, CiError};
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::process::Command;

pub struct CompileCircuitsTask;

#[derive(Serialize, Deserialize)]
pub struct AssetsJson {
    pub files: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Circuit {
    pub name: String,
    pub instance_path: String,
    pub num_public_inputs: usize,
}

impl BuildTask for CompileCircuitsTask {
    fn name(&self) -> &str {
        "CompileCircuitsTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        run_app();

        Ok(())
    }
}

fn run_app() {
    let status = Command::new(deps::JS_ENGINE)
        .current_dir(&PATHS.prfs_circuits_circom)
        .args(["run", "create-bindings"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());

    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_circuits_circom)
        .args(["run", "--release", "-p", "prfs_circuits_circom"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
