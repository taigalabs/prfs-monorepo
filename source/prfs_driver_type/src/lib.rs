pub mod drivers;
pub mod local;
mod paths;

pub type CircuitTypeError = Box<dyn std::error::Error + Sync + Send>;
