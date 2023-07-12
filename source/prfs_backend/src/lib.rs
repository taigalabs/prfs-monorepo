mod apis;
mod middleware;
pub mod router;
mod state;

pub type BackendError = Box<dyn std::error::Error + Send + Sync>;
