pub mod error_codes;
pub mod paths;

pub use error_codes::*;

pub type PrfsIdApiErrorCodesError = Box<dyn std::error::Error + Send + Sync>;
