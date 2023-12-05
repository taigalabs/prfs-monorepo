use super::task::BuildTask;
use std::process::Command;

use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};

pub struct BuildPrfsDriverUtilsJsTask;

impl BuildTask for BuildPrfsDriverUtilsJsTask {
    fn name(&self) -> &str {
        "BuildPrfsDriverUtilsJsTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let status = Command::new(JS_ENGINE)
            .current_dir(&PATHS.prfs_driver_utils_js)
            .args(["run", "build-pkg"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        Ok(())
    }
}
