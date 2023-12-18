mod apis;
pub mod error_codes;
pub mod server;

pub type IdServerError = Box<dyn std::error::Error + Send + Sync>;
