mod apis;
pub mod envs;
pub mod log;
pub mod paths;
pub mod router;

pub type ShyServerError = Box<dyn std::error::Error + Send + Sync>;
