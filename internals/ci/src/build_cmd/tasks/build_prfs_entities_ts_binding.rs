use super::task::BuildTask;
use crate::{
    build_cmd::tasks::ts_rs_format::format_ts_files,
    deps::{JS_ENGINE, PRETTIERD},
    paths::PATHS,
    BuildHandle, CiError,
};
use colored::Colorize;
use std::process::Command;
use which::which;

pub struct BuildPrfsEntitiesTSBindingTask;

impl BuildTask for BuildPrfsEntitiesTSBindingTask {
    fn name(&self) -> &str {
        "BuildPrfsEntitiesTSBindingTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        create_bindings_prfs_entities();
        create_bindings_prfs_circuit_interface();

        Ok(())
    }
}

fn create_bindings_prfs_entities() {
    if PATHS.prfs_entities__bindings.exists() {
        std::fs::remove_dir_all(&PATHS.prfs_entities__bindings).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "prfs_entities"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());

    if let None = which(PRETTIERD).ok() {
        println!("{} not found, not formatting", PRETTIERD.red());
    } else {
        format_ts_files(&PATHS.prfs_entities__bindings);
    }
}

fn create_bindings_prfs_circuit_interface() {
    if PATHS.prfs_circuit_interface__bindings.exists() {
        std::fs::remove_dir_all(&PATHS.prfs_circuit_interface__bindings).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "prfs_circuit_interface"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());

    if let None = which(PRETTIERD).ok() {
        println!("{} not found, not formatting", PRETTIERD.red());
    } else {
        format_ts_files(&PATHS.prfs_circuit_interface__bindings);
    }
}
