use crate::paths::PATHS;
use clap::ArgMatches;
use colored::Colorize;
use prfs_backend::seed::SeedJson;
use std::process::Command;

pub fn run(_matches: &ArgMatches) {
    create_seed();

    run_app();
}

fn create_seed() {
    let assets_json_path = PATHS.prf_asset_server_assets_local.join("assets.json");
    let seed_json = SeedJson {
        assets_json_path: assets_json_path.to_str().unwrap().to_string(),
    };
    let seed_json_str = serde_json::to_string_pretty(&seed_json).unwrap();

    let seed_json_path = PATHS.prfs_backend.join("seed.json");
    println!(
        "{} seed.json, path: {:?}",
        "Writing".green(),
        seed_json_path
    );

    std::fs::write(seed_json_path, seed_json_str).unwrap();
}

fn run_app() {
    let bin = "cargo";
    let status = Command::new(bin)
        .current_dir(&PATHS.prfs_backend)
        .args(["run", "-p", "prfs_backend"])
        .status()
        .expect(&format!("{} command failed to start", bin));

    assert!(status.success());
}
