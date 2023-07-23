use chrono::prelude::*;
use clap::{command, Arg, ArgAction};
use colored::Colorize;
use dotenv::dotenv;
use prfs_tree_maker::{
    apis::{climb, genesis, scan, subset, tree},
    paths::Paths,
    TreeMakerError,
};
use tracing::metadata::LevelFilter;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::{
    fmt::{format::Writer, time::FormatTime},
    prelude::__tracing_subscriber_SubscriberExt,
    EnvFilter, Layer,
};

#[tokio::main]
async fn main() -> Result<(), TreeMakerError> {
    std::env::set_var("RUST_LOG", "info");
    dotenv()?;

    let now = Utc::now();
    println!("Tree maker starts, start time: {}", now);

    let paths = Paths::new();

    let _guard = set_up_logger(&paths)?;

    run_cli_command(&paths).await?;

    Ok(())
}

async fn run_cli_command(paths: &Paths) -> Result<(), TreeMakerError> {
    let matches = command!() // requires `cargo` feature
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
            scan::run().await?;
        }
        "genesis" => {
            genesis::run().await?;
        }
        "tree" => {
            tree::run().await?;
        }
        "subset" => {
            subset::run(&paths).await?;
        }
        "climb" => {
            climb::run(&paths).await?;
        }
        _ => {
            panic!("[ci] Could not find the operation. op: {}", op);
        }
    }

    Ok(())
}

fn set_up_logger(paths: &Paths) -> Result<WorkerGuard, TreeMakerError> {
    if paths.log_files.exists() == false {
        std::fs::create_dir_all(&paths.log_files).unwrap();
    }

    let mut layers = Vec::new();

    let console_log_layer = tracing_subscriber::fmt::layer()
        .with_target(false)
        .with_timer(TimeFormat)
        .with_filter(EnvFilter::from_default_env())
        .with_filter(LevelFilter::INFO)
        .boxed();

    layers.push(console_log_layer);

    let file_appender = tracing_appender::rolling::daily(&paths.log_files, "tree_maker.log");

    let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);

    let file_log_layer = tracing_subscriber::fmt::layer()
        .with_writer(non_blocking)
        .with_target(false)
        .with_timer(TimeFormat)
        .with_ansi(false)
        .with_filter(EnvFilter::from_default_env())
        .with_filter(LevelFilter::ERROR)
        .boxed();

    layers.push(file_log_layer);

    println!(
        "File logger is attached. Log files will be periodically rotated. path: {:?}",
        paths.log_files,
    );

    println!("Following log invocation will be handled by global logger");

    let subscriber = tracing_subscriber::registry().with(layers);

    tracing::subscriber::set_global_default(subscriber).expect("Unable to set a global collector");

    tracing::info!("log info");
    tracing::warn!("log warn");
    tracing::error!("log error");

    Ok(guard)
}

pub(crate) struct TimeFormat;
impl FormatTime for TimeFormat {
    fn format_time(&self, w: &mut Writer<'_>) -> std::fmt::Result {
        let time = Utc::now().format("%y-%m-%d %H:%M:%S");
        write!(w, "{}", time)
    }
}
