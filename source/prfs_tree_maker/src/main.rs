use chrono::prelude::*;
use clap::{command, Arg};
use dotenv::dotenv;
use prfs_tree_maker::{
    apis::{scan, subsets},
    logger, TreeMakerError,
};

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "info");
    dotenv().unwrap();

    let now = Utc::now();
    println!("Tree maker starts, start time: {}", now);

    let _guard = logger::set_up_logger().unwrap();

    run_cli_command().await.unwrap();
}

async fn run_cli_command() -> Result<(), TreeMakerError> {
    let matches = command!()
        .version("v0.1")
        .propagate_version(true)
        .arg_required_else_help(true)
        .subcommand(command!("scan").arg(Arg::new("extra_args")))
        .subcommand(command!("subset").arg(Arg::new("extra_args")))
        .get_matches();

    match matches.subcommand() {
        Some(("scan", sub_matches)) => {
            scan::run_scan(sub_matches).await;
        }
        Some(("subset", sub_matches)) => {
            subsets::create_subset(sub_matches).await;
        }
        _ => unreachable!("Subcommand not defined"),
    }

    Ok(())
}
