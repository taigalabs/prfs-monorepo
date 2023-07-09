use crate::{paths::Paths, BuildHandle, CiError};

pub trait Task {
    fn name(&self) -> &str;

    fn run(&self, build_handle: &mut BuildHandle, paths: &Paths) -> Result<(), CiError>;
}
