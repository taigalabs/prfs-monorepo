mod apis;
pub mod envs;
mod paths;
mod responses;
pub mod seed;
pub mod server;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
