mod apis;
mod envs;
mod error_codes;
pub mod server;

pub type AtstServerError = Box<dyn std::error::Error + Send + Sync>;
