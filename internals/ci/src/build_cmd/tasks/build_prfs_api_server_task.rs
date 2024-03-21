use super::task::BuildTask;
use serde::{Deserialize, Serialize};
use std::process::Command;

use crate::{deps, paths::PATHS, BuildHandle, CiError};

pub struct BuildPrfsApiServerTask;

impl BuildTask for BuildPrfsApiServerTask {
    fn name(&self) -> &str {
        "BuildPrfsApiServerTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        run_app();

        Ok(())
    }
}

fn run_app() {
    let status = Command::new(deps::CARGO)
        .current_dir(&PATHS.prfs_api_server)
        .args(["build", "--release", "-p", "prfs_api_server"])
        .status()
        .expect(&format!("{} command failed to start", deps::CARGO));

    assert!(status.success());
}
