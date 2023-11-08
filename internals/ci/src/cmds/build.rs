use crate::{
    build_cmd::tasks::{
        build_js_dependencies::BuildJsDependenciesTask,
        build_prfs_driver_spartan_js::BuildPrfsDriverSpartanJsTask,
        build_prfs_driver_spartan_wasm::BuildPrfsDriverSpartanWasmTask,
        build_prfs_entities_ts_binding::BuildPrfsEntitiesTSBindingTask,
        compile_circuits::CompileCircuitsTask, run_tasks::run_tasks, task::BuildTask,
    },
    build_handle::BuildHandle,
    paths::PATHS,
    CiError,
};
use clap::ArgMatches;
use colored::Colorize;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", content = "args")]
enum BuidlTask {
    BuildPrfsEntitiesTSBindingTask,
    BuildJsDependenciesTask,
}

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    if let Ok(str) = std::fs::read_to_string(PATHS.internals_ci.join("ci.toml")) {
        println!("str: {}", str);
        // toml::from_str()
    }

    let build_tasks: Vec<Box<dyn BuildTask>> = vec![
        // Box::new(BuildPrfsEntitiesTSBindingTask),
        // Box::new(BuildJsDependenciesTask),
        // Box::new(CompileCircuitsTask),
        // Box::new(BuildPrfsDriverSpartanWasmTask),
        // Box::new(BuildPrfsDriverSpartanJsTask),
    ];

    run_tasks(sub_matches, build_tasks, build_handle).expect("Ci failed");
}
