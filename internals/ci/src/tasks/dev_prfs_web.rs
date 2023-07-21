use super::compile_circuits::AssetsJson;
use crate::{paths::PATHS, tasks::JS_ENGINE};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

const NEXT_PREFIX: &str = "NEXT_PUBLIC";

#[derive(Debug)]
enum Env {
    DEVELOPMENT,
    PRODUCTION,
}

pub fn run(matches: &ArgMatches) {
    let env = if let Some(e) = matches.get_one::<String>("env") {
        match e.as_str() {
            "production" => Env::PRODUCTION,
            _ => panic!("Invalid 'env' argumnent"),
        }
    } else {
        Env::DEVELOPMENT
    };
    println!("Start dev_prfs_web, env: {:?}", env);

    inject_prfs_web_env(&env);
    run_app();
}

fn inject_prfs_web_env(env: &Env) {
    let assets_json_path = PATHS.prf_asset_server_assets_local.join("assets.json");

    let b = std::fs::read(assets_json_path).unwrap();
    let assets_json: AssetsJson = serde_json::from_slice(&b).unwrap();

    let env_path = PATHS.prfs_web.join(".env");
    println!("{} a file, path: {:?}", "Creating".green(), env_path);

    if env_path.exists() {
        std::fs::remove_file(&env_path).unwrap();
    }

    let asset_server_endpoint = get_asset_server_endpoint(&env);
    let backend_endpoint = get_backend_endpoint(&env);

    let mut contents = vec![];

    {
        for file_path in assets_json.files {
            if file_path.ends_with(".circuit") {
                contents.push(format!(
                    "{}_ADDR_MEMBERSHIP_TEMP_CIRCUIT_URL={}/assets/{}",
                    NEXT_PREFIX, asset_server_endpoint, file_path,
                ));
            } else {
                contents.push(format!(
                    "{}_ADDR_MEMBERSHIP_TEMP_WTNS_GEN_URL={}/assets/{}",
                    NEXT_PREFIX, asset_server_endpoint, file_path,
                ));
            }
        }
    }

    {
        contents.push(format!(
            "{}_PRFS_BACKEND_ENDPOINT={}",
            NEXT_PREFIX, backend_endpoint,
        ));
    }

    {
        contents.push(format!(
            "{}_PRFS_ASSET_SERVER_ENDPOINT={}",
            NEXT_PREFIX, asset_server_endpoint,
        ));
    }

    let c = contents.join("\n");
    std::fs::write(&env_path, c).unwrap();
}

fn run_app() {
    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.prfs_web)
        .args(["run", "dev"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}

fn get_asset_server_endpoint<'a>(env: &Env) -> &'a str {
    let asset_server_endpoint = match env {
        Env::DEVELOPMENT => "http://localhost:4010",
        Env::PRODUCTION => "https://asset.prfs.xyz",
    };

    asset_server_endpoint
}

fn get_backend_endpoint<'a>(env: &Env) -> &'a str {
    let backend_endpoint = match env {
        Env::DEVELOPMENT => "http://localhost:4000",
        Env::PRODUCTION => "https://api.prfs.xyz",
    };

    backend_endpoint
}
