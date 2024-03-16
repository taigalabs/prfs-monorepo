use chrono::Utc;
use clap::{command, Arg};
use colored::Colorize;
use prfs_tree_maker::{envs::ENVS, logger, TreeMakerError};

#[tokio::main]
async fn main() {
    let rust_log_level = "info";
    println!(
        "{} rust log level, level: {}",
        "Setting".green(),
        rust_log_level
    );
    std::env::set_var("RUST_LOG", rust_log_level);

    ENVS.check();

    let now = Utc::now();
    println!("{} Tree maker, start time: {}", "Starting".green(), now);

    let _guard = logger::set_up_logger().unwrap();

    run_cli_command().await.unwrap();
}

async fn run_cli_command() -> Result<(), TreeMakerError> {
    let matches = command!()
        .version("v0.1")
        .propagate_version(true)
        .arg_required_else_help(true)
        // .subcommand(command!("scan_genesis").arg(Arg::new("extra_args")))
        // .subcommand(command!("scan").arg(Arg::new("extra_args")))
        // .subcommand(command!("set").arg(Arg::new("extra_args")))
        // .subcommand(command!("revisit").arg(Arg::new("extra_args")))
        .get_matches();

    match matches.subcommand() {
        // Some(("scan_genesis", sub_matches)) => {
        //     cmds::scan_genesis::run(sub_matches).await;
        // }
        // Some(("scan", sub_matches)) => {
        //     cmds::scan::run(sub_matches).await;
        // }
        // Some(("set", sub_matches)) => {
        //     cmds::set::run(sub_matches).await;
        // }
        // Some(("revisit", sub_matches)) => {
        //     cmds::revisit::run(sub_matches).await;
        // }
        _ => unreachable!("Subcommand not defined"),
    }

    Ok(())
}
