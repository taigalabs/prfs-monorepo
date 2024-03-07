mod apis;
pub mod bindgen;
pub mod envs;
pub mod error_codes;
pub mod log;
pub mod paths;
pub mod router;
pub mod seed;
pub mod server;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
