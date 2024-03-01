use clap::ArgMatches;

use crate::{
    build_cmd::tasks::{
        compile_circuits::CompileCircuitsTask, run_tasks::run_tasks, task::BuildTask,
    },
    build_handle::BuildHandle,
    CiError,
};

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![Box::new(CompileCircuitsTask)];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}
