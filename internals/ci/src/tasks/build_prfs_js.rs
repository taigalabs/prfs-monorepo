use crate::{paths::PATHS, task::Task, tasks::JS_ENGINE, BuildHandle, CiError};
use std::process::Command;

pub struct BuildPrfsJsTask;

impl Task for BuildPrfsJsTask {
    fn name(&self) -> &str {
        "build_prfs_js"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let status = Command::new(JS_ENGINE)
            .current_dir(&PATHS.prfs_js_path)
            .args(["run", "build-pkg"])
            .status()
            .expect(&format!("{} command failed to start", JS_ENGINE));

        assert!(status.success());

        Ok(())
    }
}
