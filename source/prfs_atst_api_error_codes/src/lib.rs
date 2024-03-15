pub mod error_codes;
pub mod paths;

pub use error_codes::*;

pub type PrfsAtstApiErrorCodesError = Box<dyn std::error::Error + Send + Sync>;
