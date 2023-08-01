mod access;
mod json;
mod program;

pub use json::*;
pub use program::*;

pub type CircuitTypeError = Box<dyn std::error::Error + Sync + Send>;
