use crate::{paths::Paths, task::Task, CiError};
use std::process::Command;

pub struct BuildJsDependenciesTask;

impl Task for BuildJsDependenciesTask {
    fn name(&self) -> &str {
        "build_js_dependencies"
    }

    fn run(
        &self,
        build_status: &mut crate::build_status::BuildStatus,
        paths: &Paths,
    ) -> Result<(), CiError> {
        let dependencies = ["externals/incremental-merkle-tree"];

        for dep in dependencies {
            let dependency_path = paths.curr_dir.join(dep);
            println!("dependency_path: {:?}", dependency_path);

            let status = Command::new("yarn")
                .current_dir(dependency_path)
                .args(["run", "build-pkg"])
                .status()
                .expect("yarn command failed to start");

            assert!(status.success());
        }

        Ok(())
    }
}
