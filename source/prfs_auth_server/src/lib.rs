mod apis;
pub mod envs;
pub mod gmail;
pub mod paths;
mod responses;
pub mod server;
mod vendors;

pub type AuthOpServerError = Box<dyn std::error::Error + Send + Sync>;
