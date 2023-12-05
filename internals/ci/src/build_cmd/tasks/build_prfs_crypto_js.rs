use super::task::BuildTask;
use crate::{
    deps::{self, JS_ENGINE},
    paths::PATHS,
    BuildHandle, CiError,
};
use colored::Colorize;
use std::process::Command;

pub struct BuildPrfsCryptoJsTask;

impl BuildTask for BuildPrfsCryptoJsTask {
    fn name(&self) -> &str {
        "BuildPrfsCryptoJsTask"
    }

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError> {
        build_wasm(build_handle);

        Ok(())
    }
}

fn build_wasm(build_handle: &mut BuildHandle) {
    let pkg_path = PATHS.prfs_crypto_js.to_str().unwrap();

    let status = Command::new(JS_ENGINE)
        .current_dir(pkg_path)
        .args(["run", "build"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
