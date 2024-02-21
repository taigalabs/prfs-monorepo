pub mod cors;
pub mod error;
pub mod io;
pub mod macros;
pub mod resp;

pub use error::*;

pub type HyperUtilsError = Box<dyn std::error::Error + Send + Sync>;
