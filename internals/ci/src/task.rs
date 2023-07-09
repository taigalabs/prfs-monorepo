use crate::{build_status::BuildStatus, CiError};

pub trait Task {
    fn name(&self) -> &str;

    fn run(&self, build_status: &mut BuildStatus) -> Result<(), CiError>;
}
