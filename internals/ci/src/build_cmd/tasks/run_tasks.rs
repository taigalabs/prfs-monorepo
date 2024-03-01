use super::task::BuildTask;
use clap::ArgMatches;
use colored::Colorize;

use crate::{build_handle::BuildHandle, CiError};

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
