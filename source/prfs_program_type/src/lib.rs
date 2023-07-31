mod access;
mod program;

pub use program::*;

pub type CircuitTypeError = Box<dyn std::error::Error + Sync + Send>;
