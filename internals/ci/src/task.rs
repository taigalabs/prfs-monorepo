use crate::{build_status::BuildStatus, paths::Paths, CiError};

pub trait Task {
    fn name(&self) -> &str;

    fn run(&self, build_status: &mut BuildStatus, paths: &Paths) -> Result<(), CiError>;
}
