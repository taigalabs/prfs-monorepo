mod apis;
mod macros;
mod middleware;
mod responses;
pub mod router;
mod state;

pub type BackendError = Box<dyn std::error::Error + Send + Sync>;
