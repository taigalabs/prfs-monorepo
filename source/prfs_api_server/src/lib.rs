mod apis;
pub mod bindgen;
pub mod envs;
pub mod error_codes;
pub mod paths;
pub mod seed;
pub mod server;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
