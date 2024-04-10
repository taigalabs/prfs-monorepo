mod build_cmd;
mod build_handle;
mod cmds;
mod create_envs;
mod deps;
mod paths;

use crate::{
    build_handle::BuildHandle,
    cmds::{
        build_circuits, build_prfs_api_server, build_prfs_crypto_js, cargo_test,
        dev_prfs_api_server, dev_prfs_asset_server, dev_prfs_console_webapp, dev_prfs_docs_website,
        dev_prfs_id_webapp, dev_prfs_poll_webapp, dev_prfs_proof_webapp, dev_shy_webapp, docker,
        seed_shy_api_data, start_prfs_api_server_blue, start_prfs_api_server_green,
        start_prfs_asset_server, start_prfs_console_webapp, start_prfs_docs_website,
        start_prfs_id_webapp, start_prfs_poll_webapp, start_prfs_proof_webapp, start_shy_webapp,
        tmux, vercel_deploy,
    },
};
use chrono::prelude::*;
use clap::{arg, command, Arg};
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
        .subcommand(command!(cmds::build_prfs_driver_spartan_js::CMD_NAME))
        .subcommand(command!(build_prfs_crypto_js::CMD_NAME))
        .subcommand(command!(build_prfs_api_server::CMD_NAME))
        .subcommand(command!(build_circuits::CMD_NAME))
        // dev mode
        .subcommand(command!(dev_prfs_console_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_proof_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_poll_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_id_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_shy_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_docs_website::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_asset_server::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(dev_prfs_api_server::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!("dev_snap"))
        // prod mode
        .subcommand(command!(start_prfs_api_server_blue::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_api_server_green::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_asset_server::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_console_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_proof_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_id_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_poll_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_shy_webapp::CMD_NAME).arg(Arg::new("extra_args")))
        .subcommand(command!(start_prfs_docs_website::CMD_NAME).arg(Arg::new("extra_args")))
        // docker
        .subcommand(
            command!(docker::CMD_NAME)
                .arg(arg!(-f <FILE> "script to run"))
                .arg(arg!(<extra_args> ... "args to run with").trailing_var_arg(true)),
        )
        // seed
        .subcommand(command!("seed_shy_api_data"))
        .subcommand(command!("seed_assets"))
        // test
        .subcommand(
            command!(cargo_test::CMD_NAME)
                .arg(arg!(<extra_args> ... "args to run with").trailing_var_arg(true)),
        )
        // tmux
        .subcommand(command!("tmux").arg(Arg::new("extra_args")))
        // Vercel
        .subcommand(command!(vercel_deploy::CMD_NAME).arg(Arg::new("extra_args")))
        .get_matches();

    let now = Utc::now();
    let timestamp = now.timestamp_millis().to_string();
    println!("{} ci: {} ({})", "Starting".green(), now, timestamp);

    match matches.subcommand() {
        // build
        Some(("build", sub_matches)) => {
            cmds::build::run(sub_matches, &timestamp);
        }
        Some((cmds::build_prfs_driver_spartan_js::CMD_NAME, sub_matches)) => {
            cmds::build_prfs_driver_spartan_js::run(sub_matches, &timestamp);
        }
        Some((build_prfs_api_server::CMD_NAME, sub_matches)) => {
            cmds::build_prfs_api_server::run(sub_matches, &timestamp);
        }
        Some((build_prfs_crypto_js::CMD_NAME, sub_matches)) => {
            cmds::build_prfs_crypto_js::run(sub_matches, &timestamp);
        }
        Some((cmds::build_circuits::CMD_NAME, sub_matches)) => {
            cmds::build_circuits::run(sub_matches, &timestamp);
        }
        // dev mode
        Some((dev_prfs_console_webapp::CMD_NAME, sub_matches)) => {
            cmds::dev_prfs_console_webapp::run(sub_matches);
        }
        Some((dev_prfs_proof_webapp::CMD_NAME, sub_matches)) => {
            dev_prfs_proof_webapp::run(sub_matches);
        }
        Some((dev_prfs_poll_webapp::CMD_NAME, sub_matches)) => {
            dev_prfs_poll_webapp::run(sub_matches);
        }
        Some((dev_prfs_id_webapp::CMD_NAME, sub_matches)) => {
            dev_prfs_id_webapp::run(sub_matches);
        }
        Some((dev_shy_webapp::CMD_NAME, sub_matches)) => {
            dev_shy_webapp::run(sub_matches);
        }
        Some((dev_prfs_asset_server::CMD_NAME, sub_matches)) => {
            dev_prfs_asset_server::run(sub_matches);
        }
        Some((dev_prfs_api_server::CMD_NAME, sub_matches)) => {
            dev_prfs_api_server::run(sub_matches);
        }
        Some((dev_prfs_docs_website::CMD_NAME, sub_matches)) => {
            dev_prfs_docs_website::run(sub_matches);
        }
        Some(("dev_snap", sub_matches)) => {
            cmds::dev_snap::run(sub_matches);
        }
        // prod mode
        Some((start_prfs_api_server_blue::CMD_NAME, sub_matches)) => {
            start_prfs_api_server_blue::run(sub_matches);
        }
        Some((start_prfs_api_server_green::CMD_NAME, sub_matches)) => {
            start_prfs_api_server_green::run(sub_matches);
        }
        Some((start_prfs_asset_server::CMD_NAME, sub_matches)) => {
            start_prfs_asset_server::run(sub_matches);
        }
        Some((start_prfs_console_webapp::CMD_NAME, sub_matches)) => {
            start_prfs_console_webapp::run(sub_matches);
        }
        Some((start_prfs_proof_webapp::CMD_NAME, sub_matches)) => {
            start_prfs_proof_webapp::run(sub_matches);
        }
        Some((start_prfs_id_webapp::CMD_NAME, sub_matches)) => {
            start_prfs_id_webapp::run(sub_matches);
        }
        Some((start_prfs_poll_webapp::CMD_NAME, sub_matches)) => {
            start_prfs_poll_webapp::run(sub_matches);
        }
        Some((start_shy_webapp::CMD_NAME, sub_matches)) => {
            cmds::start_shy_webapp::run(sub_matches);
        }
        Some((start_prfs_docs_website::CMD_NAME, sub_matches)) => {
            start_prfs_docs_website::run(sub_matches);
        }
        // docker
        Some((docker::CMD_NAME, sub_matches)) => {
            docker::run(sub_matches);
        }
        // misc
        Some((seed_shy_api_data::CMD_NAME, sub_matches)) => {
            seed_shy_api_data::run(sub_matches);
        }
        // Tmux
        Some((tmux::CMD_NAME, sub_matches)) => {
            tmux::run(sub_matches);
        }
        // Vercel
        Some((vercel_deploy::CMD_NAME, sub_matches)) => {
            cmds::vercel_deploy::run(sub_matches);
        }
        //
        Some((cargo_test::CMD_NAME, sub_matches)) => {
            cargo_test::run(sub_matches);
        }
        _ => unreachable!("Subcommand not defined"),
    }
}
