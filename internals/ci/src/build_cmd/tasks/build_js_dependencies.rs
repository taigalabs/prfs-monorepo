use super::task::BuildTask;
use std::process::Command;

use crate::{deps::JS_ENGINE, paths::PATHS, BuildHandle, CiError};

pub struct BuildJsDependenciesTask;

impl BuildTask for BuildJsDependenciesTask {
    fn name(&self) -> &str {
        "BuildJsDependenciesTask"
    }

    fn run(&self, _build_handle: &mut BuildHandle) -> Result<(), CiError> {
        let dependencies: Vec<&str> = vec![];

        for dep in dependencies {
            let dependency_path = PATHS.ws_root.join(dep);
            println!("dependency_path: {:?}", dependency_path);

            let status = Command::new(JS_ENGINE)
                .current_dir(dependency_path)
                .args(["run", "build-pkg"])
                .status()
                .expect(&format!("{} command failed to start", JS_ENGINE));

            assert!(status.success());
        }

        Ok(())
    }
}
