mod build_handle;
mod build_task;
mod cmds;
mod deps;
mod paths;

use crate::build_handle::BuildHandle;
use chrono::prelude::*;
use clap::{command, Arg};
use colored::Colorize;
use std::env;

pub type CiError = Box<dyn std::error::Error + Sync + Send>;

fn main() {
    let matches = command!()
        .version("v0.1")
        .propagate_version(true)
        .arg_required_else_help(true)
        // build
        .subcommand(command!("build"))
        .subcommand(command!("build_prfs_driver_spartan_js"))
        .subcommand(command!("build_circuits"))
        // dev mode
        .subcommand(command!("dev_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_proof").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_poll").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_vacade").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_sdk_web_module").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_docs_website").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_asset_server"))
        .subcommand(command!("dev_api_server"))
        // prod mode
        .subcommand(command!("start_api_server").arg(Arg::new("extra_args")))
        .subcommand(command!("start_asset_server").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_proof").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_poll").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_vacade").arg(Arg::new("extra_args")))
        .subcommand(command!("start_sdk_web_module").arg(Arg::new("extra_args")))
        .subcommand(command!("start_docs_website").arg(Arg::new("extra_args")))
        // docker
        .subcommand(command!("docker_run_postgres").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_webapp_proof").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_sdk_web_module").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_api_server").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_asset_server").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_default").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_down_all").arg(Arg::new("extra_args")))
        // misc
        .subcommand(command!("seed_api_server"))
        .subcommand(command!("upload_s3_asset"))
        // test
        .subcommand(command!("e2e_test_web"))
        .get_matches();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("{} ci: {} ({})", "Starting".green(), now, timestamp);

    match matches.subcommand() {
        // build
        Some(("build", sub_matches)) => {
            cmds::build::run(sub_matches, &timestamp);
        }
        Some(("build_prfs_driver_spartan_js", sub_matches)) => {
            cmds::build_prfs_driver_spartan_js::run(sub_matches, &timestamp);
        }
        Some(("build_circuits", sub_matches)) => {
            cmds::build_circuits::run(sub_matches, &timestamp);
        }
        // dev mode
        Some(("dev_sdk_web_module", sub_matches)) => {
            cmds::dev_sdk_web_module::run(sub_matches);
        }
        Some(("dev_webapp_console", sub_matches)) => {
            cmds::dev_webapp_console::run(sub_matches);
        }
        Some(("dev_webapp_proof", sub_matches)) => {
            cmds::dev_webapp_proof::run(sub_matches);
        }
        Some(("dev_webapp_poll", sub_matches)) => {
            cmds::dev_webapp_poll::run(sub_matches);
        }
        Some(("dev_webapp_vacade", sub_matches)) => {
            cmds::dev_webapp_vacade::run(sub_matches);
        }
        Some(("dev_asset_server", sub_matches)) => {
            cmds::dev_asset_server::run(sub_matches);
        }
        Some(("dev_api_server", sub_matches)) => {
            cmds::dev_api_server::run(sub_matches);
        }
        Some(("dev_docs_website", sub_matches)) => {
            cmds::dev_docs_website::run(sub_matches);
        }
        // prod mode
        Some(("start_api_server", sub_matches)) => {
            cmds::start_api_server::run(sub_matches);
        }
        Some(("start_asset_server", sub_matches)) => {
            cmds::start_asset_server::run(sub_matches);
        }
        Some(("start_sdk_web_module", sub_matches)) => {
            cmds::start_sdk_web_module::run(sub_matches);
        }
        Some(("start_webapp_console", sub_matches)) => {
            cmds::start_webapp_console::run(sub_matches);
        }
        Some(("start_webapp_proof", sub_matches)) => {
            cmds::start_webapp_proof::run(sub_matches);
        }
        Some(("start_webapp_poll", sub_matches)) => {
            cmds::start_webapp_poll::run(sub_matches);
        }
        Some(("start_webapp_vacade", sub_matches)) => {
            cmds::start_webapp_vacade::run(sub_matches);
        }
        Some(("start_docs_website", sub_matches)) => {
            cmds::start_docs_website::run(sub_matches);
        }
        // docker
        Some(("docker_run_postgres", sub_matches)) => {
            cmds::docker_run_postgres::run(sub_matches);
        }
        Some(("docker_run_webapp_console", sub_matches)) => {
            cmds::docker_run_webapp_console::run(sub_matches);
        }
        Some(("docker_run_webapp_proof", sub_matches)) => {
            cmds::docker_run_webapp_proof::run(sub_matches);
        }
        Some(("docker_run_sdk_web_module", sub_matches)) => {
            cmds::docker_run_sdk_web_module::run(sub_matches);
        }
        Some(("docker_run_api_server", sub_matches)) => {
            cmds::docker_run_api_server::run(sub_matches);
        }
        Some(("docker_run_asset_server", sub_matches)) => {
            cmds::docker_run_asset_server::run(sub_matches);
        }
        Some(("docker_run_default", sub_matches)) => {
            cmds::docker_run_default::run(sub_matches);
        }
        Some(("docker_down_all", sub_matches)) => {
            cmds::docker_down_all::run(sub_matches);
        }
        // misc
        Some(("seed_api_server", sub_matches)) => {
            cmds::seed_api_server::run(sub_matches);
        }
        Some(("upload_s3_asset", sub_matches)) => {
            cmds::upload_s3_asset::run(sub_matches);
        }
        // test
        Some(("e2e_test_web", sub_matches)) => {
            cmds::e2e_test_web::run(sub_matches);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}
