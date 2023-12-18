pub mod cors;
pub mod io;
pub mod macros;
pub mod resp;

pub type HyperUtilsError = Box<dyn std::error::Error + Send + Sync>;
