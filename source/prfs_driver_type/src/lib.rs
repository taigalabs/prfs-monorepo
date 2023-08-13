pub mod driver_ids;
pub mod local;
mod paths;

pub type CircuitTypeError = Box<dyn std::error::Error + Sync + Send>;
