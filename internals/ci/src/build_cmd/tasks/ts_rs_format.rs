use colored::Colorize;
use std::path::PathBuf;
use std::process::Command;

use crate::deps::JS_ENGINE;
use crate::paths::PATHS;

// Currently, ts-rs (6.2.1) 'format' feature compiles with error (in dependency)
pub fn format_ts_files(dir_path: &PathBuf) {
    println!(
        "{} formatting ts files, dir: {:?}",
        "Start".green(),
        dir_path
    );

    let status = Command::new(JS_ENGINE)
        .current_dir(&PATHS.ws_root)
        .args(["exec", "prettier", "--write", dir_path.to_str().unwrap()])
        .status()
        .expect("prettier command failed to start");

    assert!(status.success());
}
