pub mod cors;
pub mod io;

pub type HyperUtilsError = Box<dyn std::error::Error + Send + Sync>;
