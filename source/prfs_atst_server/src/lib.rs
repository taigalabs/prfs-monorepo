mod apis;
pub mod envs;
pub mod router;

pub type AtstServerError = Box<dyn std::error::Error + Send + Sync>;
