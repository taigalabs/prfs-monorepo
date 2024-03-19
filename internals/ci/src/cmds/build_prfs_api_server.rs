use clap::ArgMatches;

use crate::{
    build_cmd::tasks::{
        build_prfs_api_server_task::BuildPrfsApiServerTask, run_tasks::run_tasks, task::BuildTask,
    },
    build_handle::BuildHandle,
    CiError,
};

pub const CMD_NAME: &str = "build_prfs_api_server";

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![Box::new(BuildPrfsApiServerTask)];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}
