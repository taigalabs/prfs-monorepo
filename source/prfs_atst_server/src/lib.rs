mod apis;
pub mod gmail;
pub(crate) mod mock;
pub mod router;

pub type AtstServerError = Box<dyn std::error::Error + Send + Sync>;
