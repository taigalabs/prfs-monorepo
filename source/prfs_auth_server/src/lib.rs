mod apis;
mod error_codes;
pub mod gmail;
pub mod server;
mod vendors;

pub type AuthOpServerError = Box<dyn std::error::Error + Send + Sync>;
