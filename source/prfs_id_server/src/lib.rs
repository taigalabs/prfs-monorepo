mod apis;
pub mod router;

pub type IdServerError = Box<dyn std::error::Error + Send + Sync>;
