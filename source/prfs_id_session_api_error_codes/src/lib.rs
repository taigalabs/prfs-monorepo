pub mod error_codes;
pub mod paths;

pub type IdSessionServerErrorCodesError = Box<dyn std::error::Error + Send + Sync>;
