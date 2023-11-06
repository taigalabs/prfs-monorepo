use crate::{
    build::{
        build_js_dependencies::BuildJsDependenciesTask,
        build_prfs_driver_spartan_js::BuildPrfsDriverSpartanJsTask,
        build_prfs_driver_spartan_wasm::BuildPrfsDriverSpartanWasmTask,
        build_prfs_entities_ts_binding::BuildPrfsEntitiesTSBindingTask,
        compile_circuits::CompileCircuitsTask, run_tasks::run_tasks, task::BuildTask,
    },
    build_handle::BuildHandle,
};
use clap::ArgMatches;

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![
        Box::new(BuildPrfsDriverSpartanWasmTask),
        Box::new(BuildPrfsDriverSpartanJsTask),
    ];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}
