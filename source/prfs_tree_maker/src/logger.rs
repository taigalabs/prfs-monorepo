use crate::{paths::PATHS, TreeMakerError};
use chrono::Utc;
use tracing::metadata::LevelFilter;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::{
    fmt::{format::Writer, time::FormatTime},
    prelude::__tracing_subscriber_SubscriberExt,
    EnvFilter, Layer,
};

pub fn set_up_logger() -> Result<WorkerGuard, TreeMakerError> {
    if PATHS.log_files.exists() == false {
        std::fs::create_dir_all(&PATHS.log_files).unwrap();
    }

    let mut layers = Vec::new();

    let console_log_layer = tracing_subscriber::fmt::layer()
        .with_target(false)
        .with_timer(TimeFormat)
        .with_filter(EnvFilter::from_default_env())
        .with_filter(LevelFilter::INFO)
        .boxed();

    layers.push(console_log_layer);

    let file_appender = tracing_appender::rolling::daily(&PATHS.log_files, "tree_maker.log");

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
        PATHS.log_files,
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
