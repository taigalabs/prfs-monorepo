use chrono::Utc;
use clap::{command, Arg};
use prfs_tree_maker::{
    apis::{scan, set},
    envs::ENVS,
    logger, TreeMakerError,
};

#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "info");

    ENVS.check();

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
        .subcommand(command!("set").arg(Arg::new("extra_args")))
        .get_matches();

    match matches.subcommand() {
        Some(("scan_genesis", sub_matches)) => {
            scan::scan_genesis(sub_matches).await;
        }
        Some(("scan", sub_matches)) => {
            scan::scan_ledger(sub_matches).await;
        }
        Some(("set", sub_matches)) => {
            set::create_set(sub_matches).await;
        }
        _ => unreachable!("Subcommand not defined"),
    }

    Ok(())
}
