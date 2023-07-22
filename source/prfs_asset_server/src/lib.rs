pub mod apis;
pub mod paths;
pub mod router;
pub mod state;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;
