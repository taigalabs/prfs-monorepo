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
        .subcommand(command!("build"))
        .subcommand(command!("e2e_test_web"))
        .subcommand(command!("dev_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_proof").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_poll").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_webapp_vacade").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_sdk_web_module").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_asset_server"))
        .subcommand(command!("dev_api_server"))
        .subcommand(command!("seed_api_server"))
        .subcommand(command!("start_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_proof").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_poll").arg(Arg::new("extra_args")))
        .subcommand(command!("start_webapp_vacade").arg(Arg::new("extra_args")))
        //
        .subcommand(command!("docker_run_postgres").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_webapp_console").arg(Arg::new("extra_args")))
        .subcommand(command!("docker_run_webapp_proof").arg(Arg::new("extra_args")))
        .get_matches();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("{} ci: {} ({})", "Starting".green(), now, timestamp);

    match matches.subcommand() {
        Some(("build", sub_matches)) => {
            cmds::build::run(sub_matches, &timestamp);
        }
        Some(("e2e_test_web", sub_matches)) => {
            cmds::e2e_test_web::run(sub_matches);
        }
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
        Some(("dev_asset_server", sub_matches)) => {
            cmds::dev_asset_server::run(sub_matches);
        }
        Some(("dev_api_server", sub_matches)) => {
            cmds::dev_api_server::run(sub_matches);
        }
        Some(("seed_api_server", sub_matches)) => {
            cmds::seed_api_server::run(sub_matches);
        }
        //
        Some(("docker_run_postgres", sub_matches)) => {
            cmds::docker_run_postgres::run(sub_matches);
        }
        Some(("docker_run_webapp_console", sub_matches)) => {
            cmds::docker_run_webapp_console::run(sub_matches);
        }
        Some(("docker_run_webapp_proof", sub_matches)) => {
            cmds::docker_run_webapp_proof::run(sub_matches);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}
