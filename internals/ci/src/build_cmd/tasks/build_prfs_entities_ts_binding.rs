use super::task::BuildTask;
use std::process::Command;

use crate::{
    build_cmd::tasks::ts_rs_format::format_ts_files, deps::JS_ENGINE, paths::PATHS, BuildHandle,
    CiError,
};

pub struct BuildPrfsEntitiesTSBindingTask;

impl BuildTask for BuildPrfsEntitiesTSBindingTask {
    fn name(&self) -> &str {
        "BuildPrfsEntitiesTSBindingTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        create_bindings_prfs_entities();
        create_bindings_prfs_env();
        create_bindings_prfs_circuit_interface();
        create_bindings_prfs_driver_interface();
        create_bindings_shy_entities();

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
    format_ts_files(&PATHS.prfs_entities__bindings);
}

fn create_bindings_prfs_env() {
    if PATHS.prfs_env__bindings.exists() {
        std::fs::remove_dir_all(&PATHS.prfs_env__bindings).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "prfs_env"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
    format_ts_files(&PATHS.prfs_env__bindings);
}

fn create_bindings_prfs_circuit_interface() {
    let bindings_path = PATHS.prfs_circuit_interface.join("bindings");
    if bindings_path.exists() {
        std::fs::remove_dir_all(&bindings_path).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "prfs_circuit_interface"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
    format_ts_files(&bindings_path);
}

fn create_bindings_prfs_driver_interface() {
    let bindings_path = PATHS.prfs_driver_interface.join("bindings");
    if bindings_path.exists() {
        std::fs::remove_dir_all(&bindings_path).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "prfs_driver_interface"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
    format_ts_files(&bindings_path);
}

fn create_bindings_shy_entities() {
    if PATHS.shy_entities__bindings.exists() {
        std::fs::remove_dir_all(&PATHS.shy_entities__bindings).unwrap();
    }

    let status = Command::new("cargo")
        .args(["test", "-p", "shy_entities"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
    format_ts_files(&PATHS.shy_entities__bindings);
}
