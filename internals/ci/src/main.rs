mod build_handle;
mod build_task;
mod cmds;
mod deps;
mod paths;

use crate::build_handle::BuildHandle;
use chrono::prelude::*;
use clap::{command, Arg, ArgMatches};
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
        .subcommand(command!("dev_prfs_web").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_sdk_web_ui").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_asset_server"))
        .subcommand(command!("dev_api_server"))
        .subcommand(command!("seed_api_server"))
        .subcommand(command!("start_prfs_web").arg(Arg::new("extra_args")))
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
        Some(("dev_prfs_web", sub_matches)) => {
            cmds::dev_prfs_web::run(sub_matches);
        }
        Some(("dev_sdk_web_ui", sub_matches)) => {
            cmds::dev_sdk_web_ui::run(sub_matches);
        }
        Some(("start_prfs_web", sub_matches)) => {
            cmds::start_prfs_web::run(sub_matches);
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
        _ => unreachable!("Subcommand not defined"),
    }
}
