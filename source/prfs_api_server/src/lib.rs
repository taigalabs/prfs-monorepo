mod apis;
pub mod envs;
pub mod log;
pub mod paths;
pub mod router;
pub mod server;

#[cfg(test)]
pub mod seed;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
