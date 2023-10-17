use crate::{
    build_handle::BuildHandle,
    build_task::{
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

pub fn run_tasks(
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
