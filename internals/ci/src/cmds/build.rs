use crate::{
    build_handle::BuildHandle,
    build_task::{
        build_driver_interface_ts_binding::BuildDriverInterfaceTSBindingTask,
        build_js_dependencies::BuildJsDependenciesTask,
        build_prfs_driver_spartan_js::BuildPrfsDriverSpartanJsTask,
        build_prfs_driver_spartan_wasm::BuildPrfsDriverSpartanWasmTask,
        build_prfs_entities_ts_binding::BuildPrfsEntitiesTSBindingTask,
        compile_circuits::CompileCircuitsTask, task::BuildTask,
    },
    CiError,
};
use clap::ArgMatches;
use colored::Colorize;

pub fn run(sub_matches: &ArgMatches, timestamp: &String) {
    let build_handle = BuildHandle {
        timestamp: timestamp.to_string(),
    };

    let tasks: Vec<Box<dyn BuildTask>> = vec![
        // Box::new(BuildDriverInterfaceTSBindingTask),
        // Box::new(BuildPrfsEntitiesTSBindingTask),
        // Box::new(BuildJsDependenciesTask),
        Box::new(CompileCircuitsTask),
        // Box::new(BuildPrfsDriverSpartanWasmTask),
        // Box::new(BuildPrfsDriverSpartanJsTask),
    ];

    run_tasks(sub_matches, tasks, build_handle).expect("Ci failed");
}

fn run_tasks(
    _matches: &ArgMatches,
    tasks: Vec<Box<dyn BuildTask>>,
    mut build_handle: BuildHandle,
) -> Result<(), CiError> {
    for t in &tasks {
        println!(
            "\n{} a task: {}",
            "Executing".green().bold(),
            t.name().cyan().bold()
        );

        match t.run(&mut build_handle) {
            Ok(_) => (),
            Err(err) => {
                println!("Error executing task, err: {}", err.to_string());

                return Err(err);
            }
        }
    }

    println!(
        "{} building, tasks done: {}",
        "Success".green(),
        tasks.len()
    );

    Ok(())
}
