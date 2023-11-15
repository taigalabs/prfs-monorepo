mod apis;
pub mod envs;
pub mod gmail;
pub mod paths;
mod responses;
pub mod server;

pub type EmailAuthServerError = Box<dyn std::error::Error + Send + Sync>;
