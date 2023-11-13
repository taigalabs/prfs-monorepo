mod apis;
pub mod envs;
pub mod paths;
mod responses;
pub mod server;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
