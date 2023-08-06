use super::task::BuildTask;
use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};
use std::process::Command;

pub struct BuildDriverInterfaceTSBindingTask;

impl BuildTask for BuildDriverInterfaceTSBindingTask {
    fn name(&self) -> &str {
        "BuildDriverInterfaceTSBindingTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        if PATHS.prfs_driver_type_bindings.exists() {
            std::fs::remove_dir_all(&PATHS.prfs_driver_type_bindings).unwrap();
        }

        let status = Command::new("cargo")
            .args(["test", "-p", "prfs_driver_type"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        Ok(())
    }
}
