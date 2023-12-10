mod apis;
pub mod envs;
pub mod paths;
pub mod seed;
pub mod server;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
