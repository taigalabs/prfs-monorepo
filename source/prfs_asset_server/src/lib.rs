pub mod envs;
pub mod paths;
pub mod server;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;
