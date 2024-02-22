mod apis;
pub mod envs;
mod error_codes;
pub mod paths;
pub mod router;
pub mod server;

pub type ShyServerError = Box<dyn std::error::Error + Send + Sync>;
