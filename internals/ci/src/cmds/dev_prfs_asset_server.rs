use clap::ArgMatches;
use std::process::Command;

use crate::paths::PATHS;

pub const CMD_NAME: &str = "dev_prfs_asset_server";

pub fn run(_matches: &ArgMatches) {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_asset_server)
        .args(["run", "-p", "prfs_asset_server"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
