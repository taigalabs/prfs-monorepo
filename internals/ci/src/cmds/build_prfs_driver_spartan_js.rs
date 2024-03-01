use clap::ArgMatches;

use crate::{
    build_cmd::tasks::{
        build_prfs_crypto_js::BuildPrfsCryptoJsTask,
        build_prfs_driver_spartan_js::BuildPrfsDriverSpartanJsTask,
        build_prfs_driver_spartan_wasm::BuildPrfsDriverSpartanWasmTask, run_tasks::run_tasks,
        task::BuildTask,
    },
    build_handle::BuildHandle,
};

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![
        Box::new(BuildPrfsCryptoJsTask),
        Box::new(BuildPrfsDriverSpartanWasmTask),
        Box::new(BuildPrfsDriverSpartanJsTask),
    ];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}
