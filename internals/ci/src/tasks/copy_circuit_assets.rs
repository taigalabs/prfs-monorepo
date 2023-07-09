use crate::{build_status::BuildStatus, paths::Paths, task::Task, CiError};
use std::{env, fs, process::Command};

pub struct CopyProofAssetsTask;

impl Task for CopyProofAssetsTask {
    fn name(&self) -> &str {
        "copy_circuit_assets"
    }

    fn run(&self, build_status: &mut BuildStatus, paths: &Paths) -> Result<(), CiError> {
        // let files_to_serve = [format("prfs_wasm_{}_bg.wasm", build_status)];
        // paths.wasm_build_path;

        let src_path = &paths.wasm_build_path;
        let dest_path = &paths.prf_asset_serve_path;
        println!("Copying a file, src: {:?}, dest: {:?}", src_path, dest_path);

        let status = Command::new("cp")
            .args([
                "-R",
                src_path.to_str().unwrap(),
                dest_path.to_str().unwrap(),
            ])
            .status()
            .expect("cp command failed to start");
        assert!(status.success());

        Ok(())
    }
}
