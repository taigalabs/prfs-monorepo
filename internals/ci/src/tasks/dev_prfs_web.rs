use super::compile_circuits::BuildCircuitJson;
use crate::{paths::Paths, tasks::JS_ENGINE};
use clap::ArgMatches;
use colored::Colorize;
use std::process::Command;

const NEXT_PREFIX: &str = "NEXT_PUBLIC";

#[derive(Debug)]
enum Env {
    DEVELOPMENT,
    PRODUCTION,
}

pub fn run(matches: &ArgMatches, paths: &Paths) {
    println!("matches: {:?}", matches);

    let env = if let Some(e) = matches.get_one::<String>("env") {
        match e.as_str() {
            "production" => Env::PRODUCTION,
            _ => panic!("Invalid 'env' argumnent"),
        }
    } else {
        Env::DEVELOPMENT
    };
    println!("env: {:?}", env);

    inject_prfs_web_env(paths, &env);
    run_app(paths);
}

fn inject_prfs_web_env(paths: &Paths, env: &Env) {
    let build_circuits_json_path = paths.prf_asset_serve_path.join("build_circuits.json");

    let b = std::fs::read(build_circuits_json_path).unwrap();
    let build_circuits_json: BuildCircuitJson = serde_json::from_slice(&b).unwrap();

    let env_path = paths.prfs_web.join(".env");
    println!("{} a file, path: {:?}", "Recreating".green(), env_path);

    if env_path.exists() {
        std::fs::remove_file(&env_path).unwrap();
    }

    let asset_server_endpoint = match env {
        Env::DEVELOPMENT => "http://localhost:4010/assets",
        Env::PRODUCTION => "https://prfs.xyz",
    };

    let mut contents = vec![];

    {
        for (name, file_path) in build_circuits_json.files {
            contents.push(format!(
                "{}_{}_PATH={}",
                NEXT_PREFIX,
                name.to_uppercase(),
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

    {
        contents.push(format!(
            "{}_PRFS_ASSET_SERVER_ENDPOINT={}",
            NEXT_PREFIX, asset_server_endpoint,
        ));
    }

    let c = contents.join("\n");
    std::fs::write(&env_path, c).unwrap();
}

fn run_app(paths: &Paths) {
    let status = Command::new(JS_ENGINE)
        .current_dir(&paths.prfs_web)
        .args(["run", "dev"])
        .status()
        .expect(&format!("{} command failed to start", JS_ENGINE));

    assert!(status.success());
}
