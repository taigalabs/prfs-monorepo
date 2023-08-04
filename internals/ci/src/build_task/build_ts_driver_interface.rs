use super::task::BuildTask;
use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};
use std::process::Command;

pub struct BuildTsDriverInterfaceTask;

impl BuildTask for BuildTsDriverInterfaceTask {
    fn name(&self) -> &str {
        stringify!(BuildTsDriverInterfaceTask)
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let status = Command::new(JS_ENGINE)
            .current_dir(&PATHS.prfs_driver_spartan_js)
            .args(["run", "build-pkg"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        Ok(())
    }
}
