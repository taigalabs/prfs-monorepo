mod apis;
pub mod log;
pub mod paths;
pub mod router;

pub type IdSessionServerError = Box<dyn std::error::Error + Send + Sync>;
