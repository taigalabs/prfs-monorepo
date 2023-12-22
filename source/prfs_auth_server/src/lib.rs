mod apis;
pub mod gmail;
pub mod server;
mod vendors;

pub type AuthOpServerError = Box<dyn std::error::Error + Send + Sync>;
