pub mod fs;
pub mod markdown;
pub mod serde;

pub type RustUtilsError = Box<dyn std::error::Error + Sync + Send>;
