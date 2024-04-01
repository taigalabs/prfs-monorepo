pub mod fs;
pub mod serde;

pub type RustUtilsError = Box<dyn std::error::Error + Sync + Send>;
