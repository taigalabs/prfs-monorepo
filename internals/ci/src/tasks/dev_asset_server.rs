use crate::paths::PATHS;
use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_asset_server)
        .args(["run", "-p", "prfs_asset_server"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
