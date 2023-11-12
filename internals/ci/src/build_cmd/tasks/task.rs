use crate::{build_handle::BuildHandle, CiError};
use colored::Colorize;

pub trait BuildTask {
    fn name(&self) -> &str;

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError>;
}
