mod apis;
pub(crate) mod error_codes;
pub mod event_loop;
pub mod peer_map;
pub mod router;

pub type IdSessionServerError = Box<dyn std::error::Error + Send + Sync>;
