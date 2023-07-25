use chrono::prelude::*;
use clap::{command, Arg, ArgAction};
use colored::Colorize;
use dotenv::dotenv;
use prfs_tree_maker::{
    apis::{scan, subsets},
    logger,
    paths::PATHS,
    TreeMakerError,
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
        .arg(Arg::new("operation").action(ArgAction::Append))
        .get_matches();

    let op = matches
        .get_one::<String>("operation")
        .expect("operation needs to be given")
        .clone();

    let op_str = op.as_str();

    println!("Operation: {}", op_str.cyan().bold());

    match op.as_str() {
        "scan" => {
            scan::run_scan().await;
        }
        "subset" => {
            subsets::create_subset().await;
        }
        _ => {
            panic!("[ci] Could not find the operation. op: {}", op);
        }
    }

    Ok(())
}
