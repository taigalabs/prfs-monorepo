mod apis;
pub mod response;
pub mod server;

pub type IdServerError = Box<dyn std::error::Error + Send + Sync>;
