pub mod apis;
pub mod envs;
pub mod local;
pub mod paths;
pub mod server;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;
