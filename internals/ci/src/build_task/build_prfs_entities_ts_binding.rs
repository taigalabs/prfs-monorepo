use super::task::BuildTask;
use crate::{
    build_task::ts_rs_format::format_ts_files,
    deps::{JS_ENGINE, PRETTIERD},
    paths::PATHS,
    BuildHandle, CiError,
};
use std::process::Command;
use which::which;

pub struct BuildPrfsEntitiesTSBindingTask;

impl BuildTask for BuildPrfsEntitiesTSBindingTask {
    fn name(&self) -> &str {
        "BuildPrfsEntitiesTSBindingTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        if PATHS.prfs_entities_bindings.exists() {
            std::fs::remove_dir_all(&PATHS.prfs_entities_bindings).unwrap();
        }

        let status = Command::new("cargo")
            .args(["test", "-p", "prfs_entities"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        if let Ok(_) = which(PRETTIERD) {
            format_ts_files(&PATHS.prfs_entities_bindings);
        }

        println!("A");

        Ok(())
    }
}
