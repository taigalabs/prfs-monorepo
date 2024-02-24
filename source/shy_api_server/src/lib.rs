mod apis;
pub mod envs;
mod error_codes;
pub mod paths;
pub mod router;

pub type ShyServerError = Box<dyn std::error::Error + Send + Sync>;
