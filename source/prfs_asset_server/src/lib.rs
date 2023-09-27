pub mod apis;
pub mod local;
pub mod paths;
pub mod server;
pub mod utils;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;
