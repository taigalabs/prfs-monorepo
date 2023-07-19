use clap::ArgMatches;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    let bin = "cargo";
    let status = Command::new(bin)
        .args(["run", "-p", "prfs_prf_asset_server"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
