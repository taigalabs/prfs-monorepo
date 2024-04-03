use clap::ArgMatches;

use crate::{
    build_cmd::tasks::{
        build_prfs_api_server_task::BuildPrfsApiServerTask, run_tasks::run_tasks, task::BuildTask,
    },
    build_handle::BuildHandle,
    paths::PATHS,
    CiError,
};

pub const CMD_NAME: &str = "build_prfs_api_server";

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let dest_path = &PATHS.ws_root.join("prfs_api_server");
    if dest_path.exists() {
        std::fs::remove_file(&dest_path).unwrap();
    }

    let tasks: Vec<Box<dyn BuildTask>> = vec![Box::new(BuildPrfsApiServerTask)];
    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");

    let bin_path = PATHS.ws_root.join("target/release/prfs_api_server");
    if !bin_path.exists() {
        panic!("Could not find the binary, path: {:?}", bin_path);
    }

    std::fs::copy(bin_path, &dest_path).expect("copy failed");
}
