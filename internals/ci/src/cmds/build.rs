use clap::ArgMatches;
use colored::Colorize;
use serde::{Deserialize, Serialize};

use crate::{
    build_cmd::{
        build_prfs_crypto_js::BuildPrfsCryptoJsTask,
        tasks::{
            build_js_dependencies::BuildJsDependenciesTask,
            build_prfs_driver_spartan_js::BuildPrfsDriverSpartanJsTask,
            build_prfs_driver_spartan_wasm::BuildPrfsDriverSpartanWasmTask,
            build_prfs_entities_ts_binding::BuildPrfsEntitiesTSBindingTask,
            compile_circuits::CompileCircuitsTask, run_tasks::run_tasks, task::BuildTask,
        },
    },
    build_handle::BuildHandle,
    paths::PATHS,
};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
struct CiTOML {
    build_tasks: Vec<BuildTaskLabel>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum BuildTaskLabel {
    BuildPrfsEntitiesTSBindingTask,
    BuildJsDependenciesTask,
    CompileCircuitsTask,
    BuildPrfsDriverSpartanWasmTask,
    BuildPrfsDriverSpartanJsTask,
    BuildPrfsCryptoJsTask,
}

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    if let Ok(str) = std::fs::read_to_string(PATHS.internals_ci.join("ci.toml")) {
        println!(
            "{} ci.toml at: {:?}, parsing",
            "Found".green(),
            PATHS.internals_ci.join("ci.toml")
        );
        //
        if let Ok(ci_toml) = toml::from_str::<CiTOML>(&str) {
            println!("ci.toml: {:?}", ci_toml);

            let mut build_tasks: Vec<Box<dyn BuildTask>> = vec![];
            for task in ci_toml.build_tasks {
                match task {
                    BuildTaskLabel::BuildPrfsEntitiesTSBindingTask => {
                        build_tasks.push(Box::new(BuildPrfsEntitiesTSBindingTask));
                    }
                    BuildTaskLabel::BuildJsDependenciesTask => {
                        build_tasks.push(Box::new(BuildJsDependenciesTask));
                    }
                    BuildTaskLabel::CompileCircuitsTask => {
                        build_tasks.push(Box::new(CompileCircuitsTask));
                    }
                    BuildTaskLabel::BuildPrfsDriverSpartanWasmTask => {
                        build_tasks.push(Box::new(BuildPrfsDriverSpartanWasmTask));
                    }
                    BuildTaskLabel::BuildPrfsDriverSpartanJsTask => {
                        build_tasks.push(Box::new(BuildPrfsDriverSpartanJsTask))
                    }
                    BuildTaskLabel::BuildPrfsCryptoJsTask => {
                        build_tasks.push(Box::new(BuildPrfsCryptoJsTask))
                    }
                }
            }

            run_tasks(sub_matches, build_tasks, build_handle).expect("Ci failed");
            return;
        }
    }

    let build_tasks: Vec<Box<dyn BuildTask>> = vec![
        Box::new(BuildPrfsEntitiesTSBindingTask),
        Box::new(BuildJsDependenciesTask),
        Box::new(CompileCircuitsTask),
        Box::new(BuildPrfsDriverSpartanWasmTask),
        Box::new(BuildPrfsDriverSpartanJsTask),
        Box::new(BuildPrfsCryptoJsTask),
    ];

    run_tasks(sub_matches, build_tasks, build_handle).expect("Ci failed");
}
