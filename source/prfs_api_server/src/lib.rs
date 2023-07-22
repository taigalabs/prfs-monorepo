mod apis;
mod middleware;
mod responses;
pub mod router;
pub mod seed;
mod state;

pub type ApiServerError = Box<dyn std::error::Error + Send + Sync>;
