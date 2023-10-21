use super::task::BuildTask;
use std::process::Command;

use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};

pub struct BuildPrfsDriverSpartanJsTask;

impl BuildTask for BuildPrfsDriverSpartanJsTask {
    fn name(&self) -> &str {
        "BuildPrfsDriverSpartanJsTask"
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
