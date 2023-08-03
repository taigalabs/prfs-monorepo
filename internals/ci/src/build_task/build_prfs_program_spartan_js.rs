use super::task::BuildTask;
use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};
use std::process::Command;

pub struct BuildPrfsProgramSpartanJsTask;

impl BuildTask for BuildPrfsProgramSpartanJsTask {
    fn name(&self) -> &str {
        "build_prfs_js"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let status = Command::new(JS_ENGINE)
            .current_dir(&PATHS.prfs_program_spartan_js)
            .args(["run", "build-pkg"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        Ok(())
    }
}
