mod build_cmd;
mod build_handle;
mod cmds;
mod deps;
mod paths;
mod utils;

use crate::{
    build_handle::BuildHandle,
    cmds::{
        dev_prfs_console_webapp, dev_prfs_id_webapp, dev_prfs_poll_webapp, dev_prfs_proof_webapp,
        dev_shy_webapp, docker_run_prfs_console_webapp, docker_run_prfs_proof_webapp,
        start_prfs_console_webapp, start_prfs_id_webapp, start_prfs_poll_webapp,
        start_prfs_proof_webapp, start_shy_webapp,
    },
};
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
        .subcommand(command!("build_crypto_js"))
        .subcommand(command!("build_circuits"))
        // dev mode
        .subcommand(command!(dev_prfs_console_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_proof_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_poll_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_id_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!("dev_shy_webapp").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_sdk_web_module").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_docs_website").arg(Arg::new("extra_args")))
        .subcommand(command!("dev_asset_server"))
        .subcommand(command!("dev_snap"))
        .subcommand(command!("dev_api_server"))
        // prod mode
        .subcommand(command!("start_api_server").arg(Arg::new("extra_args")))
        .subcommand(command!("start_asset_server").arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_console_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_proof_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_id_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_poll_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!("start_shy_webapp").arg(Arg::new("extra_args")))
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
        // seed
        .subcommand(command!("seed_api_data"))
        .subcommand(command!("seed_assets"))
        // test
        .subcommand(command!("e2e_test_web"))
        // tmux
        .subcommand(command!("tmux").arg(Arg::new("extra_args")))
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
        Some(("build_prfs_crypto_js", sub_matches)) => {
            cmds::build_prfs_crypto_js::run(sub_matches, &timestamp);
        }
        Some(("build_circuits", sub_matches)) => {
            cmds::build_circuits::run(sub_matches, &timestamp);
        }
        // dev mode
        Some(("dev_sdk_web_module", sub_matches)) => {
            cmds::dev_sdk_web_module::run(sub_matches);
        }
        Some((dev_prfs_console_webapp::CMD_NAME, sub_matches)) => {
            cmds::dev_prfs_console_webapp::run(sub_matches);
        }
        Some((dev_prfs_proof_webapp::CMD_NAME, sub_matches)) => {
            cmds::dev_prfs_proof_webapp::run(sub_matches);
        }
        Some((dev_prfs_poll_webapp::CMD_NAME, sub_matches)) => {
            cmds::dev_prfs_poll_webapp::run(sub_matches);
        }
        Some((dev_prfs_id_webapp::CMD_NAME, sub_matches)) => {
            dev_prfs_id_webapp::run(sub_matches);
        }
        Some((dev_shy_webapp::CMD_NAME, sub_matches)) => {
            cmds::dev_shy_webapp::run(sub_matches);
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
        Some(("dev_snap", sub_matches)) => {
            cmds::dev_snap::run(sub_matches);
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
            cmds::start_prfs_console_webapp::run(sub_matches);
        }
        Some((start_prfs_proof_webapp::CMD_NAME, sub_matches)) => {
            cmds::start_prfs_proof_webapp::run(sub_matches);
        }
        Some((start_prfs_id_webapp::CMD_NAME, sub_matches)) => {
            start_prfs_id_webapp::run(sub_matches);
        }
        Some((start_prfs_poll_webapp::CMD_NAME, sub_matches)) => {
            cmds::start_prfs_poll_webapp::run(sub_matches);
        }
        Some((start_shy_webapp::CMD_NAME, sub_matches)) => {
            cmds::start_shy_webapp::run(sub_matches);
        }
        Some(("start_docs_website", sub_matches)) => {
            cmds::start_docs_website::run(sub_matches);
        }
        // docker
        Some(("docker_run_postgres", sub_matches)) => {
            cmds::docker_run_postgres::run(sub_matches);
        }
        Some((docker_run_prfs_console_webapp::CMD_NAME, sub_matches)) => {
            cmds::docker_run_prfs_console_webapp::run(sub_matches);
        }
        Some((docker_run_prfs_proof_webapp::CMD_NAME, sub_matches)) => {
            cmds::docker_run_prfs_proof_webapp::run(sub_matches);
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
        Some(("seed_api_data", sub_matches)) => {
            cmds::seed_api_data::run(sub_matches);
        }
        Some(("seed_assets", sub_matches)) => {
            cmds::seed_assets::run(sub_matches);
        }
        // test
        Some(("e2e_test_web", sub_matches)) => {
            cmds::e2e_test_web::run(sub_matches);
        }
        // test
        Some(("tmux", sub_matches)) => {
            cmds::tmux::run(sub_matches);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}
