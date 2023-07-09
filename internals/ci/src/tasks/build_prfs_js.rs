use crate::{paths::Paths, task::Task, BuildHandle, CiError};
use std::process::Command;

pub struct BuildPrfsJsTask;

impl Task for BuildPrfsJsTask {
    fn name(&self) -> &str {
        "build_prfs_js"
    }

    fn run(&self, build_handle: &mut BuildHandle, paths: &Paths) -> Result<(), CiError> {
        let status = Command::new("yarn")
            .current_dir(&paths.prfs_js_path)
            .args(["run", "build-pkg"])
            .status()
            .expect("yarn command failed to start");

        assert!(status.success());

        Ok(())
    }
}
