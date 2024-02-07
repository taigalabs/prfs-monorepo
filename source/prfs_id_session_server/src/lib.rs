mod apis;
pub(crate) mod error_codes;
pub mod peer_map;
pub mod server;

pub type IdSessionServerError = Box<dyn std::error::Error + Send + Sync>;
