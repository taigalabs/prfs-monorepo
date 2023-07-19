use super::compile_circuits::BuildCircuitJson;
use crate::{paths::PATHS, tasks::JS_ENGINE};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

const NEXT_PREFIX: &str = "NEXT_PUBLIC";

pub fn run(_matches: &ArgMatches) {
    inject_prfs_web_env();
    build_app();
    start_app();
}

fn inject_prfs_web_env() {
    let build_circuits_json_path = PATHS.prf_asset_server_assets_local.join("build.json");

    let b = std::fs::read(build_circuits_json_path).unwrap();
    let build_circuits_json: BuildCircuitJson = serde_json::from_slice(&b).unwrap();

    let env_path = PATHS.prfs_web.join(".env");
    println!("{} a file, path: {:?}", "Recreating".green(), env_path);

    if env_path.exists() {
        std::fs::remove_file(&env_path).unwrap();
    }

    let serve_url_host = "http://localhost:4010/assets";

    let mut contents = vec![];

    {
        for (name, file_path) in build_circuits_json.files {
            contents.push(format!(
                "{}_{}_URL={}/{}",
                NEXT_PREFIX,
                name.to_uppercase(),
                serve_url_host,
                file_path
            ));
        }
    }

    {
        contents.push(format!(
            "{}_PRFS_BACKEND_ENDPOINT={}",
            NEXT_PREFIX, "http://localhost:4000/api/v0",
        ));
    }

    let c = contents.join("\n");
    std::fs::write(&env_path, c).unwrap();
}

fn build_app() {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "build"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}

fn start_app() {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "start"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
