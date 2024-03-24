pub mod envs;
mod paths;
pub mod state;

pub use state::*;

pub type CommonServerStateError = Box<dyn std::error::Error + Send + Sync>;
