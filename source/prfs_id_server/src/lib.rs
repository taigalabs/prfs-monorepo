mod apis;
mod responses;
pub mod server;

pub type IdServerError = Box<dyn std::error::Error + Send + Sync>;
