pub mod cors;
pub mod io;
pub mod resp;

pub type HyperUtilsError = Box<dyn std::error::Error + Send + Sync>;
