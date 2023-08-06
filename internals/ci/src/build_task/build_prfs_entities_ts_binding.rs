use super::task::BuildTask;
use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};
use std::process::Command;

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

        Ok(())
    }
}
