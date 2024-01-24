mod apis;
mod error_codes;
pub mod gmail;
pub(crate) mod mock;
pub mod server;

pub type AtstServerError = Box<dyn std::error::Error + Send + Sync>;
