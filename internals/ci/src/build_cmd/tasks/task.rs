use crate::{build_handle::BuildHandle, CiError};

pub trait BuildTask {
    fn name(&self) -> &str;

    fn run(&self, build_handle: &mut BuildHandle) -> Result<(), CiError>;
}
