pub mod apis;
pub mod local;
pub mod paths;
pub mod router;
pub mod state;
pub mod utils;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;
