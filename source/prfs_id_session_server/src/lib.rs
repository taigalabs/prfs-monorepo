mod apis;
pub mod error_codes;
pub mod server;

pub type IdSessionServerError = Box<dyn std::error::Error + Send + Sync>;
