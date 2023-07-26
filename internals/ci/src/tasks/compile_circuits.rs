use crate::{paths::PATHS, task::Task, BuildHandle, CiError};
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

impl Task for CompileCircuitsTask {
    fn name(&self) -> &str {
        "compile_circuits"
    }

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError> {
        run_app();

        Ok(())
    }
}

fn run_app() {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_circuits_circom)
        .args(["run", "-p", "prfs_circuits_circom"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
